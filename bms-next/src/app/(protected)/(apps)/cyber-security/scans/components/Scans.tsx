"use client";
import { RiRobot2Fill, RiStackFill } from "@remixicon/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../misc/components/Tabs"//"/components/Tabs"
import { useState } from "react";
import {
  Plus,
  Shield,
  Network,
  Upload,
  Book,
  XCircle,
} from "lucide-react";
import ScanModal from "./ScanModal";
import PortScanModal from "./PortScanModal";
import ComplianceScanModal from "./ComplianceScanModal";
import AssetListUpload from "./AssetListUpload";
import SpecializedAIAgents from "./SpecializedAIAgents";
import type { ScanResult } from "../../misc/lib/scanner"//"@/lib/scanner";
import type { PortScanResult } from "../../misc/lib/portScanner";
import type { ComplianceScanResult } from "./ComplianceScanModal";
import CyberSecurityComponents from "./CyberSecurityComponents";

export function Scans() {
  const [activeTab, setActiveTab] = useState<
    "cyberSecurity" | "specializedAIAgents"
  >("cyberSecurity");
  const [showQuickScan, setShowQuickScan] = useState(false);
  const [showPortScan, setShowPortScan] = useState(false);
  const [showComplianceScan, setShowComplianceScan] = useState(false);
  const [showAssetUpload, setShowAssetUpload] = useState(false);

  const handleQuickScanComplete = async (result: ScanResult) => {
    console.log("Quick scan completed:", result);

    result.findings.forEach((finding) => {
      console.log(`[${finding.severity.toUpperCase()}] ${finding.title}`);
      console.log(`Description: ${finding.description}`);
      console.log(`Remediation: ${finding.remediation}`);
      console.log("---");
    });
  };

  const handlePortScanComplete = async (results: PortScanResult[]) => {
    console.log("Port scan completed:", results);

    results.forEach((result) => {
      console.log(`Port ${result.port} (${result.service}): ${result.state}`);
      result.vulnerabilities?.forEach((vuln) => {
        console.log(`[${vuln.severity.toUpperCase()}] ${vuln.title}`);
        console.log(`Description: ${vuln.description}`);
        console.log(`Remediation: ${vuln.remediation}`);
        if (vuln.cvss) console.log(`CVSS: ${vuln.cvss}`);
        console.log("---");
      });
    });
  };

  const handleComplianceScanComplete = async (result: ComplianceScanResult) => {
    console.log("Compliance scan completed:", result);
    setShowComplianceScan(false);
  };

  // if (true) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[50vh] animate-pulse duration-1000 text-primary ">
  //       <ShieldEllipsis className="h-12 w-12  " />
  //       <p className="text-2xl ml-2">Loading ...</p>
  //     </div>
  //   );
  // }

  // const { withLoading } = useGlobalLoading();
  // const loadSpinner = async () => {
  //   await withLoading(async () => {
  //     // Simulate an API call
  //     await new Promise((resolve) => setTimeout(resolve, 123000));
  //     console.log("Data fetched successfully!");
  //   });
  // };

  return (
    <>

      <div className="justify-between items-center mb-8">

        {/* <div className="flex justify-between items-center mb-8">
>>>>>>> 31e96a83980fa29181cecba9362a351adac9ae2a
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Security Scans
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage security assessments with Cyber Security Components &
            specialized AI agents
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAssetUpload(true)}
            className="btn-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Assets
          </button>
          <button
            onClick={() => setShowComplianceScan(true)}
            className="btn-primary"
          >
            <Book className="h-4 w-4 mr-2" />
            Compliance Scan
          </button>
          <button onClick={() => setShowPortScan(true)} className="btn-primary">
            <Network className="h-4 w-4 mr-2" />
            Port Scan
          </button>
          <button
            onClick={() => setShowQuickScan(true)}
            className="btn-primary"
          >
            <Shield className="h-4 w-4 mr-2" />
            Quick Scan
          </button>
          <button onClick={() => { }} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Target
          </button>
        </div>
<<<<<<< HEAD
      </div>
=======
      </div> */}

        <Tabs defaultValue="tab1">
          <TabsList variant="solid" >
            <TabsTrigger value="tab1" className="gap-1.5 flex ">
              <RiStackFill className="-ml-1 size-4" aria-hidden="true" />
              Cyber Security Components
            </TabsTrigger>
            <TabsTrigger value="tab2" className="gap-1.5 flex ">
              <RiRobot2Fill className="-ml-1 size-4" aria-hidden="true" />
              Specialized AI Agents
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="tab1">
              <div>
                <CyberSecurityComponents />
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div>
                <SpecializedAIAgents />
              </div>
            </TabsContent>
          </div>
        </Tabs>


        {showQuickScan && (
          <ScanModal
            onClose={() => setShowQuickScan(false)}
            onScanComplete={handleQuickScanComplete}
          />
        )}

        {showPortScan && (
          <PortScanModal
            onClose={() => setShowPortScan(false)}
            onScanComplete={handlePortScanComplete}
          />
        )}

        {showComplianceScan && (
          <ComplianceScanModal
            onClose={() => setShowComplianceScan(false)}
            onScanComplete={handleComplianceScanComplete}
          />
        )}

        {/* Asset Upload Modal */}
        {showAssetUpload && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Upload className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Import Asset List
                  </h2>
                </div>
                <button
                  onClick={() => setShowAssetUpload(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <AssetListUpload />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
