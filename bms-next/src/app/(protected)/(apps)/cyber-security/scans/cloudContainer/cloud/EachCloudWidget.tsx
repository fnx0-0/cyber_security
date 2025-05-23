import { RiSettings5Line } from "@remixicon/react";
import { Card } from "@tremor/react";
import Link from "next/link";

function clickHandle(url: string) {
  //redirect(url);

}

export default function CloudWidget({ item }: { item: any }) {

  return (
    <Card
      key={item.name}
      className="relative flex flex-col rounded-lg justify-between 
     hover:bg-tremor-background-muted 
     hover:dark:bg-dark-tremor-background-muted"
    >
      <div className="flex items-center space-x-3">
        <span
          className="flex size-12 shrink-0 items-center 
      justify-center text-primary rounded-md border 
      border-tremor-border p-1 dark:border-dark-tremor-border"
        >
          {item.icon}
        </span>
        <dt
          className="text-tremor-default font-medium 
      text-widget-mainHeader"
        >
          <Link href={item.href} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden={true} />
            {item.name}
          </Link>
        </dt>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex-1">
          <dd
            className="text-tremor-default leading-6 
        text-widget-mainDesc"
          >
            {item.description}
          </dd>
        </div>
        <div className="mt-6 flex items-center space-x-2">
          <RiSettings5Line
            className="size-5 text-widget-secondaryheader"
            aria-hidden={true}
          />
          <p className="text-tremor-default text-widget-secondaryheader">
            {item.configurationCount > 1
              ? `${item.configurationCount} Configurations`
              : `${item.configurationCount} Configuration`}
          </p>
        </div>
      </div>
    </Card>
  );
}
