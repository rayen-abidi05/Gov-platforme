
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { logActivity } = require("../lib/activityLog");

const getMinisterFormulaires = async (req, res) => {
    try {
        const { status } = req.query;

        const formulaires = await prisma.ministerFormulaire.findMany({
            where: status ? { status } : undefined,
            orderBy: { submittedAt: "desc" },
            include: {
                registrationRequest: {
                    include: {
                        company: {
                            select: {
                                commName: true,
                                rne: true,
                                nationality: true,
                                matFisc: true,
                                user: { select: { name: true, email: true } },
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json({ formulaires });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reviewMinisterFormulaire = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body; // status: "APPROVED" | "REJECTED"

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const formulaire = await prisma.ministerFormulaire.update({
            where: { id },
            data: { status, notes, reviewedAt: new Date() },
            include: {
                registrationRequest: {
                    include: { company: { select: { commName: true, userId: true } } },
                },
            },
        });

        const company = formulaire.registrationRequest.company;

        if (status === "APPROVED") {
            // Notify every Admin to proceed with INSPA — this does NOT touch User.status
            const admins = await prisma.user.findMany({
                where: { role: "ADMIN" },
                select: { id: true },
            });

            await prisma.notification.createMany({
                data: admins.map((admin) => ({
                    userId: admin.id,
                    title: "Formulaire ministériel approuvé",
                    message: `Le Ministre a approuvé le dossier de ${company.commName}. Veuillez contacter l'INSPA pour la suite.`,
                    isRead: false,
                })),
            });
        } else {
            // REJECTED — let the exporter know directly
            await prisma.notification.create({
                data: {
                    userId: company.userId,
                    title: "Formulaire ministériel rejeté",
                    message: notes
                        ? `Votre demande a été rejetée par le Ministère : ${notes}`
                        : "Votre demande a été rejetée par le Ministère.",
                    isRead: false,
                },
            });
        }

        await logActivity({
            userId: req.user.id,
            action: status === "APPROVED" ? "APPROVE_MINISTER_FORMULAIRE" : "REJECT_MINISTER_FORMULAIRE",
            entity: "MinisterFormulaire",
            entityId: formulaire.id,
        });

        res.status(200).json(formulaire);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMinisterFormulaires, reviewMinisterFormulaire };