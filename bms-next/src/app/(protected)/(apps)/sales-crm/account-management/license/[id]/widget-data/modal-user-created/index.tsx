import { useState, useEffect } from "react";
import FormInput from "@/ikon/components/form-fields/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { format, isAfter, isBefore, parse, subMonths } from "date-fns";
import { map } from "zod";
import { UserData } from "@/app/(protected)/(apps)/ssd/components/type";

interface NewCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappedUserDetail: any;
  accountId: string;
  selDate: string;
}

const UserCreatedModal: React.FC<NewCreatedModalProps> = ({
  isOpen,
  onClose,
  mappedUserDetail,
  accountId,
  selDate
}) => {
  const [totalUsers, setTotalUsers] = useState(0);
 
  const [month, setMonth] = useState([]);
  const [newUser, setNewUser] = useState(0);

  useEffect(() => {
    if (mappedUserDetail) {
      let userCount = 0;

      console.log(mappedUserDetail)
      const converterData = mappedUserDetail
      const currentDate = ""

    //   const startDate = converterData?.billingPeriod?.startDate
    //   ? parse(converterData.billingPeriod.startDate, "yyyy-MM", new Date())
    //   : null;
    // const endDate = converterData?.billingPeriod?.endDate
    //   ? parse(converterData.billingPeriod.endDate, "yyyy-MM", new Date())
    //   : null;

    // let selectedDate = getSelectedDate(currentDate);
    // let selectedDateMoment = parse(selectedDate, "yyyy-MM", new Date());

    // if (
    //   (startDate && isBefore(selectedDateMoment, startDate)) ||
    //   (endDate && isAfter(selectedDateMoment, endDate))
    // ) {
    //   selectedDate = endDate ? format(endDate, "yyyy-MM") : selectedDate;
    // }
    // setSelDate(selectedDate);

    let userDetailsMonthMap =
    converterData.converterConfigDataServerMap.Production["User List"]
      .monthWiseUserStatus;

      const mappedUserDetails = mapUserDetailsByDate(userDetailsMonthMap);
    console.log("mappedUserDetails ", Object.keys(mappedUserDetails));

    const monthsArray = Object.keys(mappedUserDetails).map((date, index) => ({
        value: date,
        label: date,
      }));
      setMonth(monthsArray);
  
     let newUsersCreated = mappedUserDetails[selDate][0].newUsersData.length;
      console.log("newUsersCreated ", newUsersCreated);
  
      setNewUser(newUsersCreated);


    // const parsedDate = parse(selectedDate, "yyyy-MM", new Date());
    // const pastMonth = format(subMonths(parsedDate, 1), "yyyy-MM");

    // console.log("past month ", pastMonth);
    //   for (let i in mappedUserDetail) {
    //     userCount += mappedUserDetail[i]?.newUsersData?.length || 0;
    //   }
    //   setTotalUsers(userCount);
    }
  }, [mappedUserDetail]);

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

  console.log("mappedUserDetail", mappedUserDetail);
  
 

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>New Users</DialogTitle>
        </DialogHeader>
        <div>
          {/* <FormInput name="totalUsers"  formControl={undefined} /> */}

          <Input value={newUser} readOnly />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreatedModal;
