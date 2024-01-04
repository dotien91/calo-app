import React, { useMemo, useCallback } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

/**
 * ? Local Imports
 */
import RecordView from "./RecordView";

interface RecordModalProps {
  uploadRecord: () => void;
}

const RecordModal: React.FC<RecordModalProps> = React.forwardRef(
  ({ uploadRecord }, ref) => {
    const bottomSheetModalRef = React.useRef(null);

    const openModal = () => {
      bottomSheetModalRef.current?.present();
      bottomSheetModalRef.current?.expand();
    };

    React.useImperativeHandle(ref, () => {
      return {
        openModal,
      };
    });

    const snapPoints = useMemo(() => [1, "50%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={0}
          appearsOnIndex={1}
        />
      ),
      [],
    );

    const closeModal = () => {
      bottomSheetModalRef.current?.close();
    };

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
        >
          <RecordView closeModal={closeModal} uploadRecord={uploadRecord} />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);
RecordModal.displayName = "RecordModal";
export default React.memo(RecordModal);
