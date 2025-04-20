"use client";
import { WidgetProps } from "@/ikon/components/widgets/type";
import {
  getMyInstancesV2,
  getParameterizedDataForTaskId,
} from "@/ikon/utils/api/processRuntimeService";
import Widgets from "@/ikon/components/widgets";
import { useEffect, useMemo, useState } from "react";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { parse, format, isBefore, isAfter, subMonths } from "date-fns";
import { columns, extraParams } from "./monthWise-license-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import ComboboxInput from "@/ikon/components/combobox-input";
import UserCreatedModal from "./modal-user-created";

interface AdminUserData {
  accountId: string;
  [key: string]: any;
}

interface LicenseDetailsPrpos {
  date: string;
  name: string;
  billed: number;
  unbilled: number;
  suspend: number;
}

interface User {
  userLogin: string | null;
  userActive: boolean;
  userInvited: boolean;
  userPhone: string | null;
  userEmail: string | null;
  userName: string | null;
  userId: string | null;
}

interface WidgetDataProps {
  id: string;
}

interface UserData {
  billableUsersData: any;
  unbilledUsersData: any;
  deactivatedUsersData: any;
  date: string;
  newUsersData: Array<{
    isAdmin: boolean;
    userName: string;
    isActive: boolean;
    userId: string;
    events?: Array<{
      actor: string;
      event: string;
      timestamp: string;
    }>;
  }>;
}

interface DropdownProps {
  mappedUserDetails: Record<string, any>;
}

export default function WidgetData({ id }: WidgetDataProps) {
  const [accountId, setAccountId] = useState<string>(id);
  const [account, setAccount] = useState<any[]>([]);
  const [billingAccount, setBillingAccount] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<Record<string, AdminUserData>>(
    {}
  );
  const [excludeUsers, setExcludeUsers] = useState<
    Record<string, AdminUserData>
  >({});
  const [combineConvUsers, setCombineConvUsers] = useState<
    Record<string, AdminUserData>
  >({});
  const [userNameIdMap, setIdMap] = useState<{ [key: string]: string | null }>(
    {}
  );
  const [userNameLoginMap, setLoginMap] = useState<{
    [key: string]: string | null;
  }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  const [newUser, setNewUser] = useState(0);
  const [deactivatedUsers, setDeactivateUser] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [selDate, setSelDate] = useState("");

  const [userData, setUserData] = useState<
    {
      date: string;
      name: string;
      billed: number;
      unbilled: number;
      suspend: number;
    }[]
  >([]);
  const [month, setMonth] = useState([]);
  const [mappedUserDetail, setMappedUserDetail] = useState<
    Record<string, UserData>
  >({});

  const [converterData, setConverterData] = useState<
  Record<string, UserData>
>({});

  const [mappedSeverDetail, setMappedSeverDetail] = useState<
    Record<string, UserData>
  >({});

  useEffect(() => {
    setAccountId(id);
  }, [id]);

  const handleOpenModal = (type: string) => {
    setIsModalOpen(true);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const fetchLicenseData = async () => {
    try {
      // const accountInsData = await getMyInstancesV2({
      //   processName: "Account",
      //   predefinedFilters: { taskName: "View State" },
      //   projections: ["Data"],
      // });

      // const accountData = accountInsData.map((e: any) => e.data);
      // setAccount(accountData);

      // const billingInsData = await getMyInstancesV2({
      //   processName: "Billing Account",
      //   predefinedFilters: { taskName: "View" },
      //   projections: ["Data"],
      // });

      // const billingData = billingInsData.map((e: any) => e.data);
      // setBillingAccount(billingData);

      // Fetch admin users and transform data
      // const adminUsersIns = await getMyInstancesV2({
      //   processName: "Mark Admin Users",
      //   predefinedFilters: { taskName: "Mark Admin Users" },
      //   projections: ["Data"],
      // });

      // const transformedAdminUsers: Record<string, AdminUserData> = {};
      // adminUsersIns.forEach((entry: any) => {
      //   const data = entry.data;
      //   if (data.accountId) {
      //     transformedAdminUsers[data.accountId] = data;
      //   }
      // });

      // setAdminUsers(transformedAdminUsers);
      // console.log("Admin Users:", transformedAdminUsers);

      // // Fetch Billing Users Excluder
      // const excludeBillingIns = await getMyInstancesV2({
      //   processName: "Billing Users Excluder",
      //   predefinedFilters: { taskName: "Exclude Billing Users" },
      //   projections: ["Data"],
      // });

      // const excludeBillingUsers: Record<string, AdminUserData> = {};
      // excludeBillingIns.forEach((entry: any) => {
      //   const data = entry.data;
      //   if (data.accountId) {
      //     excludeBillingUsers[data.accountId] = data;
      //   }
      // });

      // setExcludeUsers(excludeBillingUsers);
      // console.log("Exclude Users:", excludeBillingUsers);

      // Fetch Combined Converter Data
      const combinedConverterIns = await getMyInstancesV2({
        processName: "Combined Converter Data",
        predefinedFilters: { taskName: "Combine Converter Data" },
        projections: ["Data"],
      });

      const parameterizedData = await getParameterizedDataForTaskId({
        taskId: combinedConverterIns[0]?.taskId,
        parameters: {},
      });
      const converterData =
        parameterizedData === undefined
          ? null
          : parameterizedData["_POST_PROCESSED_DATA_"];
      console.log("Combine Converter data:", converterData);

      setConverterData(converterData);

      const converterDataMap: Record<string, AdminUserData> = {};
      combinedConverterIns.forEach((entry: any) => {
        const data = entry.data;
        if (data.accountId) {
          converterDataMap[data.accountId] = data;
        }
      });

      setCombineConvUsers(converterDataMap);
      console.log("Combine Converter Users:", converterDataMap);

      var data = await getUserIdWiseUserDetailsMap();
      //console.log("Users all ", data);

      const idMap: { [key: string]: string | null } = {};
      const tempLoginMap: { [key: string]: string | null } = {};
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          //console.log(data[key]);
          idMap[data[key].userId] = data[key].userName;
          tempLoginMap[data[key].userLogin] = data[key].userName;
        }
      }

      // console.log("id map../", idMap);
      // console.log("login map../", tempLoginMap);
      // setIdMap(idMap);
      // setLoginMap(tempLoginMap);

      // let markAdminUsersObject = transformedAdminUsers[accountId] ?? {};
      // let excludeUsersObject = excludeBillingUsers[accountId] ?? {};

      // const serverWiseAdminUsers =
      //   markAdminUsersObject.serverWiseAdminUsers ?? {};
      // const serverWiseNonAdminUsers =
      //   markAdminUsersObject.serverWiseNonAdminUsers ?? {};
      // const excludedIdServerMap = excludeUsersObject.excludedIdServerMap ?? {};
      const converterDataProcessed = converterData[accountId];

      const currentDate = null;
      const widgetData = getWidgetData(converterData, currentDate);
      console.log("widgetData ", widgetData);

      // processUserData(
      //   converterData,
      //   transformedAdminUsers,
      //   excludeBillingUsers,
      //   accountId
      // );
    } catch (error) {
      console.error("Error fetching License:", error);
    }
  };

  const getWidgetData = (
    converterData: Record<string, AdminUserData>,
    currentDate: string | null
  ) => {
    const converterConfigDataServerMap =
      converterData["converterConfigDataServerMap"] || {};
    const startDate = converterData?.billingPeriod?.startDate
      ? parse(converterData.billingPeriod.startDate, "yyyy-MM", new Date())
      : null;
    const endDate = converterData?.billingPeriod?.endDate
      ? parse(converterData.billingPeriod.endDate, "yyyy-MM", new Date())
      : null;

    let selectedDate = getSelectedDate(currentDate);
    let selectedDateMoment = parse(selectedDate, "yyyy-MM", new Date());

    if (
      (startDate && isBefore(selectedDateMoment, startDate)) ||
      (endDate && isAfter(selectedDateMoment, endDate))
    ) {
      selectedDate = endDate ? format(endDate, "yyyy-MM") : selectedDate;
    }
    setSelDate(selectedDate);
    const parsedDate = parse(selectedDate, "yyyy-MM", new Date());
    const pastMonth = format(subMonths(parsedDate, 1), "yyyy-MM");

    console.log("past month ", pastMonth);

    let newUsersCreated = 0;
    let usersDeactivated = 0;
    let totalActiveUsers = 0;
    let userDetailsMonthMap =
      converterData.converterConfigDataServerMap.Production["User List"]
        .monthWiseUserStatus;
    const mappedUserDetails = mapUserDetailsByDate(userDetailsMonthMap);
    console.log("mappedUserDetails ", mappedUserDetails);

    setMappedUserDetail({ ...userDetailsMonthMap });

    let serverDetailsMonthMap =
      converterData.serverWiseConverterData[0].monthWiseUserStatus;

    //const mappedServerDetails = mapUserDetailsByDate(serverDetailsMonthMap);
    console.log("serverDetailsMonthMap ", serverDetailsMonthMap);

    setMappedSeverDetail({ ...serverDetailsMonthMap });

    const monthsArray = Object.keys(mappedUserDetails).map((date, index) => ({
      value: date,
      label: date,
    }));
    setMonth(monthsArray);

    newUsersCreated = mappedUserDetails[selectedDate][0].newUsersData.length;
    console.log("newUsersCreated ", newUsersCreated);

    setNewUser(newUsersCreated);

    usersDeactivated =
      mappedUserDetails[selectedDate][0].deactivatedUsersData.length;
    console.log("usersDeactivated ", usersDeactivated);

    setDeactivateUser(usersDeactivated);

    totalActiveUsers =
      mappedUserDetails[pastMonth][0].newUsersData.length + newUsersCreated;
    console.log("totalActiveUsers ", totalActiveUsers);
    setTotalActive(totalActiveUsers);

    const transformedData = Object.keys(mappedUserDetails).flatMap((date) => {
      const record = mappedUserDetails[date][0];

      const adminUnbilled = record.unbilledUsersData.filter(
        (user: { isAdmin: any }) => user.isAdmin
      ).length;
      const nonAdminUnbilled = record.unbilledUsersData.filter(
        (user: { isAdmin: any }) => !user.isAdmin
      ).length;

      const adminSuspend = record.deactivatedUsersData.filter(
        (user: { isAdmin: any }) => user.isAdmin
      ).length;
      const nonAdminSuspend = record.deactivatedUsersData.filter(
        (user: { isAdmin: any }) => !user.isAdmin
      ).length;

      return [
        {
          date: record.date,
          name: "Admin",
          billed: record.billableUsersData.length,
          unbilled: adminUnbilled,
          suspend: adminSuspend,
        },
        {
          date: record.date,
          name: "Non-Admin",
          billed: record?.billableUsersData.length,
          unbilled: nonAdminUnbilled,
          suspend: nonAdminSuspend,
        },
      ];
    });

    console.log("transformedData  ", transformedData);
    setUserData(transformedData);

    const userDetailsObject: Record<
      string,
      {
        totalUsers: number;
        adminUsers: number;
        activeUsers: number;
        deactivatedUsers: number;
      }
    > = {};
  };

  const mapUserDetailsByDate = (
    userDetails: UserData[]
  ): Record<string, UserData[]> => {
    return userDetails.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, UserData[]>);
  };

  const getSelectedDate = (currentDate: string | null): string => {
    return currentDate ?? format(new Date(), "yyyy-MM");
  };

  useEffect(() => {
    fetchLicenseData();
  }, []);

  const getFilteredUsers = useMemo(() => {
    //console.log("Mapped User Detail:", mappedUserDetail);

    let filteredUsers: {
      username: string;
      admin: boolean;
      production: string;
      uat: string;
      preProduction: string;
      development: string;
    }[] = [];

    for (let i in mappedUserDetail) {
      if (mappedUserDetail[i].date === selDate) {
        console.log("Matching Users Data:", mappedUserDetail[i].newUsersData);

        for (let j = 0; j < mappedUserDetail[i].newUsersData.length; j++) {
          let user = mappedUserDetail[i].newUsersData[j];
          filteredUsers.push({
            userName: user.userName,
            admin: user.isAdmin,
            production: "Yes",
            uat: "No",
            preProduction: "No",
            development: "No",
          });
        }

        break;
      }
    }

    if (filteredUsers.length === 0) {
      console.warn(`No data found for the selected date: ${selDate}`);
    }

    console.log("Filtered Users:", filteredUsers);
    return filteredUsers;
  }, [selDate, mappedUserDetail]);

  const getFilteredServer = useMemo(() => {
    console.log("Mapped Server Detail:", mappedSeverDetail);

    let filteredServers: {
      production: string;
      activeUser: number;
      excludeUsers: number;
    }[] = [];

    for (let i in mappedSeverDetail) {
      if (mappedSeverDetail[i].date === selDate) {
        var activeUsers = mappedSeverDetail[i].newUsersData.length;
        var excludedUsers = mappedSeverDetail[i]?.newExcludedUsersData.length;

        filteredServers = [
          {
            server: "Production",
            activeUser: activeUsers,
            excludeUsers: excludedUsers,
          },
        ];

        break;
      }
    }

    console.log("Filtered Users:", filteredServers);
    return filteredServers;
  }, [selDate, mappedSeverDetail]);

  const widgetData: WidgetProps[] = [
    {
      id: "newUsersCreated",
      widgetText: "New Users Created",
      widgetNumber: "" + newUser,
      iconName: "user" as const,
      onButtonClickfunc: () => handleOpenModal("newUsers"),
    },
    {
      id: "usersDeactivated",
      widgetText: "Users Deactivated",
      widgetNumber: "" + deactivatedUsers,
      iconName: "user-minus" as const,
      onButtonClickfunc: () => console.log("Users Deactivated clicked"),
    },
    {
      id: "totalActiveUsers",
      widgetText: "Total Active Users",
      widgetNumber: "" + totalActive,
      iconName: "user" as const,
      onButtonClickfunc: () => console.log("Total Active Users clicked"),
    },
  ];

  const columnForUsers: ColumnDef<any>[] = [
    {
      accessorKey: "userName",
      header: () => <div style={{ textAlign: "center" }}>User name</div>,
      cell: ({ row }) => <span>{row.original?.userName}</span>,
    },
    {
      accessorKey: "production",
      header: () => <div style={{ textAlign: "center" }}>Production</div>,
      cell: ({ row }) => <span>{row.original?.production}</span>,
    },
    {
      accessorKey: "admin",
      header: () => <div style={{ textAlign: "center" }}>Admin</div>,
      cell: ({ row }) => <span>{row.original?.admin}</span>,
    },
    {
      accessorKey: "preProduction",
      header: () => <div style={{ textAlign: "center" }}>Pre-Production</div>,
      cell: ({ row }) => <span>{row.original?.preProduction}</span>,
    },
    {
      accessorKey: "uat",
      header: () => <div style={{ textAlign: "center" }}>UAT</div>,
      cell: ({ row }) => <span>{row.original?.uat}</span>,
    },
    {
      accessorKey: "development",
      header: () => <div style={{ textAlign: "center" }}>Development</div>,
      cell: ({ row }) => <span>{row.original?.development}</span>,
    },
  ];

  const columnForServers: ColumnDef<any>[] = [
    {
      accessorKey: "server",
      header: () => <div style={{ textAlign: "center" }}>Server</div>,
      cell: ({ row }) => <span>{row.original?.server}</span>,
    },
    {
      accessorKey: "activeUser",
      header: () => <div style={{ textAlign: "center" }}>Active Users</div>,
      cell: ({ row }) => <span>{row.original?.activeUser}</span>,
    },
    {
      accessorKey: "excludeUsers",
      header: () => <div style={{ textAlign: "center" }}>Exluded Users</div>,
      cell: ({ row }) => <span>{row.original?.excludeUsers}</span>,
    },
  ];

  const extraParam: DTExtraParamsProps = {
    pageSize: 5,
  };

  return (
    <div className="flex flex-col gap-3">
      <Widgets widgetData={widgetData} />
      <DataTable columns={columns} data={userData} extraParams={extraParams} />

      <div className="month w-1/4 ml-auto">
        <ComboboxInput
          items={month}
          placeholder="Please Select the month"
          onSelect={(selectedMonth: any) => setSelDate(selectedMonth)}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-3/4">
          <DataTable
            columns={columnForUsers}
            data={getFilteredUsers}
            extraParams={extraParam}
          />
        </div>

        <div className="w-1/3">
          <DataTable
            columns={columnForServers}
            data={getFilteredServer}
            extraParams={extraParam}
          />
        </div>
      </div>

      {modalType === "newUsers" && (
        <UserCreatedModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mappedUserDetail={converterData}
          accountId={accountId}
          selDate={selDate}
        />
      )}
    </div>
  );
}
