import { StoreSlice } from "@zustand";

interface IMyBankAcc {
  _id: string;
  bank_account_name: string;
  bank_name: string;
  bank_number: any;
  payment_method: string;
}

export interface PaymentSlice {
  myBankAccounts: IMyBankAcc[];
  setMyBankAccount: (data: IMyBankAcc[]) => void;
  updateMyBankAccounts: (item: IMyBankAcc, method: string) => void;
  bankSelected?: IMyBankAcc;
  setBankSelected: (data?: IMyBankAcc) => void;
}

const createPaymentSlice: StoreSlice<PaymentSlice> = (set, get) => ({
  myBankAccounts: [],
  setMyBankAccount: (data: IMyBankAcc[]) => {
    set(() => ({
      myBankAccounts: data,
    }));
  },
  updateMyBankAccounts: (item, method: string) => {
    const { myBankAccounts } = get();
    let newData = [...myBankAccounts];
    if (method == "delete") {
      newData = myBankAccounts.filter((_item) => _item._id != item._id);
    } else if (method == "add") {
      newData = [item, ...myBankAccounts];
    } else {
      const findIndex = myBankAccounts.findIndex(
        (_item) => _item._id == item._id,
      );
      console.log("findIndexfindIndex", { findIndex, item, myBankAccounts });
      newData = newData.map((item) => ({ ...item, isDefault: false }));
      if (findIndex != -1) {
        newData[findIndex] = { ...item, isDefault: true };
      }
      // newData = [{...item, isDefault: true}, ...myBankAccounts.filter((_item) => _item.id != item.id)];
    }

    console.log("updateMyBankAccounts store", method, newData);
    set(() => ({
      myBankAccounts: newData,
    }));
  },
  bankSelected: undefined,
  setBankSelected: (data?: IMyBankAcc) => {
    set({ bankSelected: data });
  },
});

export default createPaymentSlice;
