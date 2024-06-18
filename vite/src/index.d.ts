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
  marketContract: Contract;
  nftContract: Contract;
  orderContract: Contract;
  tokenContract: Contract;
  uniswapContract: Contract;
  addCart: (item: Cart) => void;
  removeCart: (id: number) => void;
  clearCart: () => void;
  changeCart: (id: number, amount: number) => void;
  cartList: Cart[];
  notify: (text: string) => void;
  navigate: (url: string) => void;
}

interface pointer {
  lat: number;
  lng: number;
}

interface Cart {
  id: number;
  src: string;
  name: string;
  amount: number;
}

interface Menu {
  name: string;
  price: number;
  id?: number;
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

interface Item {
  listingId?: number;
  seller: string;
  tokenId: number;
  price: BigNumberish;
  amount: number;
  timestamp: number;
  sold: boolean;
}
