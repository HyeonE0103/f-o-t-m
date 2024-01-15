export interface StoreType {
  //prisma 스키마에 null값이 들어갈수 있도록 작성했기 때문에 
  id: number;
  phone?: string | null;
  address?: string | null;
  lat?: string | null;
  lng?: string | null;
  name?: string | null;
  category?: string | null;
  storeType?: string | null;
  foodCertifyName?: string | null;
}
