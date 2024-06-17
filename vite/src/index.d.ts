interface Window {
  kakao: any;
  ethereum: any;
}

interface OutletContext {
  signer: JsonRpcSigner;
  provider: BrowserProvider;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | undefined>>;
  myLatitude: number;
  myLongitude: number;
  setMyLatitude: Dispatch<SetStateAction<number | undefined>>;
  setMyLongitude: Dispatch<SetStateAction<number | undefined>>;
}

interface Address {
  lat: number;
  lng: number;
  title: string;
  address: string;
  tel: string;
  id: number;
}

interface NftData {
  name: string;
  id: number;
  price?: BigNumberish;
  amount?: number;
}
