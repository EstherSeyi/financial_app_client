import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import { useSearchCityByName } from "../hooks/city";
import { City } from "../types";

const SearchCity = () => {
  const [selected, setSelected] = useState<City | null>(null);
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = useSearchCityByName(query);
  const navigate = useNavigate();

  const handleSelect = (selected: City) => {
    setSelected(selected);
    navigate(
      `/${selected?.fields?.name}?lat=${selected?.fields?.latitude}&lon=${selected?.fields?.longitude}&geoname_id=${selected?.fields?.geoname_id}`
    );
    setSelected(null);
  };

  return (
    <div className="w-72" data-cy="search-city">
      <Combobox value={selected} onChange={handleSelect}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-highlightBlue sm:text-sm">
            <Combobox.Input
              data-cy="search-input"
              placeholder="Search By City Name..."
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-highlightBlue"
              displayValue={(city: City) => city?.fields?.name}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              data-cy="city-list"
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-midBlue py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-highlightBlue z-[1]"
            >
              {isLoading ? (
                <div data-testid="loader">Loading...</div>
              ) : isError ? (
                <div>Errored</div>
              ) : !data || data.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-white">
                  No City Found.
                </div>
              ) : (
                data.map((city) => (
                  <Combobox.Option
                    data-cy="city-item"
                    key={city.fields.geoname_id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-4 pl-10 pr-4 ${
                        active ? "bg-highlightBlue text-white" : "text-primary"
                      }`
                    }
                    value={city}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className="flex justify-between">
                          <span>
                            <span
                              className={`block truncate text-2xl ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {city?.fields?.name}
                            </span>
                            <span>{city?.fields?.country}</span>
                          </span>
                          <span className="text-xl">31°</span>
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchCity;
