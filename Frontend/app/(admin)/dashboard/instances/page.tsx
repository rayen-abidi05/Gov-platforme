"use client";

import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { useInstances } from "@/hooks/useInstances";
import AdminHeader from "@/components/admin/AdminHeader";
import Spinner from "@/components/ui/spinner";

export default function InstancesPage() {
  const { data, isLoading, isError } = useInstances();
  const instances = data?.instances ?? [];

  return (
    <>
      <AdminHeader
        title="Instances"
        subtitle="Sessions de comité pour l'examen des demandes d'exportation"
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement des instances.
          </div>
        ) : instances.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-cream-50/40">
            Aucune instance créée pour l'instant.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {instances.map((inst) => {
              const decided = inst.exportRequests.filter(
                (r) => r.status === "APPROVED" || r.status === "REJECTED"
              ).length;
              const pending = inst.exportRequests.length - decided;

              return (
                <Link
                  key={inst.id}
                  href={`/dashboard/instances/${inst.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 transition-all duration-200 hover:border-gold-300/30 hover:bg-olive-950/60"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-display text-lg text-cream-50">
                        {new Date(inst.meetingDate).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <ArrowRight className="h-4 w-4 text-cream-50/40 transition-colors duration-200 group-hover:text-gold-300" />
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-cream-50/60">
                      <Users className="h-3.5 w-3.5" />
                      {inst.members.length} membre{inst.members.length > 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3 text-xs">
                    <span className="rounded-full border border-cream-50/15 px-2.5 py-1 text-cream-50/70">
                      {inst.exportRequests.length} demande{inst.exportRequests.length > 1 ? "s" : ""}
                    </span>
                    {pending > 0 && (
                      <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-2.5 py-1 text-blue-300">
                        {pending} en attente
                      </span>
                    )}
                    {decided > 0 && (
                      <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-2.5 py-1 text-gold-300">
                        {decided} décidée{decided > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}