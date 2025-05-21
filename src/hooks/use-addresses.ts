import { useLocalStorage } from "./use-storage";

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export const useAddresses = () => {
  const [addresses, setAddresses, clearAddresses] = useLocalStorage<Address[]>(
    "user-addresses",
    []
  );

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    setAddresses((current) => {
      // Se for o primeiro endereço ou marcado como padrão, desmarca os outros
      if (newAddress.isDefault) {
        return current
          .map((addr) => ({ ...addr, isDefault: false }))
          .concat(newAddress);
      }
      return [...current, newAddress];
    });
  };

  const updateAddress = (id: string, address: Partial<Address>) => {
    setAddresses((current) =>
      current.map((addr) => {
        if (addr.id === id) {
          // Se estiver marcando como padrão, desmarca os outros
          if (address.isDefault) {
            return { ...addr, ...address, isDefault: true };
          }
          return { ...addr, ...address };
        }
        // Se outro endereço estiver sendo marcado como padrão, desmarca este
        if (address.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
  };

  const removeAddress = (id: string) => {
    setAddresses((current) => current.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((current) =>
      current.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const getDefaultAddress = () => {
    return addresses.find((addr) => addr.isDefault) || addresses[0];
  };

  return {
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    getDefaultAddress,
    clearAddresses,
  };
};
