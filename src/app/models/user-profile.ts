export interface ProfileUser {
  uid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  frontCardURL?: string,
  backCardURL?: string,
  companyCountryCode?: string,
  companyName?: string;
  position?: string;
  workPhoneNumber?: string;
  countryCode?: string;
  companyAddress?: string;
}


export interface cardData {
  uid: string;
  fronViewURL?: string;
  backViewURL?: string;
}
