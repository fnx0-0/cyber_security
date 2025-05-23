import React from "react";
import GoogleCloudConfig from "./components/cloud-configs/google-cloud-config";
import AmazonWebServicesConfig from "./components/cloud-configs/amazon-web-services-config";
import MicrosoftAzureConfig from "./components/cloud-configs/microsoft-azure-config";
import IbmCloudConfig from "./components/cloud-configs/ibm-cloud-config";
import OracleCloudConfig from "./components/cloud-configs/oracle-cloud-config";
import AlibabaCloudConfig from "./components/cloud-configs/alibaba-cloud-config";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

const globalConfigMap: Record<
  string,
  React.FC<{
    serviceUrl: string;
    serviceName: string;
  }>
> = {
  "amazon-web-services": AmazonWebServicesConfig,
  "microsoft-azure": MicrosoftAzureConfig,
  "google-cloud-platform": GoogleCloudConfig,
  "ibm-cloud": IbmCloudConfig,
  "oracle-cloud-infrastructure": OracleCloudConfig,
  "alibaba-cloud": AlibabaCloudConfig,
};

export default function CloudServiceDetails({
  params,
}: {
  params: Promise<{ serviceName: string }>;
}) {
  const unwrappedParams = React.use(params); // Unwrap the Promise here
  const serviceUrl = unwrappedParams.serviceName;
  const serviceName = serviceUrl
    .split("-") // Split the string at hyphens
    .map((word) =>
      word === "ibm"
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    ) // Capitalize the first letter of each word
    .join(" ");

  // Get the corresponding config component
  const CloudConfigTemplate = globalConfigMap[serviceUrl];

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Cloud Services",
          href: "/configuration/cloud-services",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: serviceName,
          href: `/configuration/cloud-services/${serviceUrl}`
        }}
      />
      <div className=" flex flex-col flex-grow">
        <CloudConfigTemplate
          serviceUrl={serviceUrl}
          serviceName={serviceName}
        />
      </div>
    </>
  );
}
