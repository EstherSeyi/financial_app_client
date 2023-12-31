import { Dispatch, Fragment, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

import { useGetGeolocation } from "../hooks/geolocation";
import { storeGeoLocationPermission } from "../helpers/location";

export default function UserLocationModal({
  locationReqIsOpen,
  setLocationReqIsOpen,
}: {
  locationReqIsOpen: boolean;
  setLocationReqIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { mutate } = useGetGeolocation();

  function closeModal() {
    setLocationReqIsOpen(false);
  }

  const handleRequestDenial = () => {
    storeGeoLocationPermission("denied");
    closeModal();
  };

  const handleRequestAcceptance = () => {
    mutate(undefined, {
      onSuccess(response) {
        const [lat, lon] = response.loc.split(",");
        storeGeoLocationPermission("granted");
        navigate(
          `/${response.city}?lat=${lat}&lon=${lon}&country_code=${response.country}`
        );
      },
      onError() {
        toast.error(
          "Failed! Ensure location is enabled and linient privacy protection"
        );
      },
    });
  };

  return (
    <>
      <Transition appear show={locationReqIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Location Permission Request
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Click the "Okay" button to grant this app permission to
                      get your current location.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      data-cy="okay-location-btn"
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-4"
                      onClick={handleRequestAcceptance}
                    >
                      Okay
                    </button>
                    <button
                      data-cy="no-btn"
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleRequestDenial}
                    >
                      No, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
