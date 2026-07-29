import {OverviewPage} from "@/components/marhp-exporter/OverviewPage";
import type {
  ExportRequestSummary,
  ExporterProfile,
  NotificationItem,
} from "@/components/marhp-exporter/types";
 const ray : ExporterProfile = {companyName: "string",
    category: "resident",
    liste: "liste_1",
    registrationStatus: "envoyee",
    matriculeFiscal: "string",}
export default function Page() {
  return <OverviewPage profile={ray}  requests = {[]}  notifications={[]}/>;
}