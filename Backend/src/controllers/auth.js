const {SignJWT, jwtVerify} = require('jose');

const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
const express = require("express");

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

const secret = new TextEncoder().encode(process.env.SECRET_KEY);
const secretRefresh = new TextEncoder().encode(process.env.SECRET_KEY_REFRESH);

const login = async (req, res) => {
    try {
        
    const {  email , password } = req.body; 
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    const token = await new SignJWT({ id :user.id ,email: user.email,name : user.name ,role: user.role})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2min')
        .sign(secret);
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge:  2 * 60 * 1000
    });
    const tokenRefresh = await new SignJWT({ id :user.id , email: user.email,name : user.name ,role: user.role})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secretRefresh);
    res.cookie('tokenRefresh', tokenRefresh, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(200).json({ "messgae" : "logged in!!!",role : user.role });
}catch (error) {   
     res.status(500).json({ error : error.message });
}};
const registerUser = async (req, res, status = null) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          status,
        },
      });

      if (role === "EXPORTER") {
        const {
          commName,
          rne,
          activity,
          isResident,
          city,
          governorate,
          matFisc,
          address,
          phone,
          nationality,
          isRented,
          registerState,
          labName,
          exportType,
        } = req.body;

        await tx.company.create({
          data: {
            commName,
            rne,
            activity,
            isResident,
            city,
            governorate,
            matFisc,
            address,
            phone,
            nationality,
            isRented,
            registerState,
            labName,
            exportType: exportType ? "liste1" : "liste2",
            userId: newUser.id,
          },
        });
      }

      return newUser;
    });

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    const refreshToken = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretRefresh);

    res.cookie("tokenRefresh", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target;

        if (Array.isArray(target)) {
          if (target.includes("email")) {
            return res.status(409).json({
              field: "email",
              message: "Cette adresse e-mail est déjà utilisée.",
            });
          }

          if (target.includes("rne")) {
            return res.status(409).json({
              field: "rne",
              message: "Ce numéro RNE existe déjà.",
            });
          }

          if (target.includes("matFisc")) {
            return res.status(409).json({
              field: "matFisc",
              message: "Cette matricule fiscale existe déjà.",
            });
          }
        }

        return res.status(409).json({
          message: "Une valeur unique existe déjà.",
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Erreur interne du serveur.",
    });
  }
};

    const logout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, 
    path: "/",
    maxAge: 2 * 60 * 1000,
  });
 
  res.clearCookie("tokenRefresh", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "logged out" });
};


const verify = async (req,res) =>{
    try {
        const basicUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
            });

        if (!basicUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let user = basicUser;

        if (basicUser.role === "EXPORTER") {
            user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                company: true,
                },
            });
        }
      

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
}
const users = async (req,res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({ users });
    } catch (error) {
         res.status(500).json({ error : error.message });
    }
}
module.exports = {
    verify,
    registerUser,
    login,
    logout,
    users
};