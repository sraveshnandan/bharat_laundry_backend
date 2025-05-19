const typeDefs = `#graphql

scalar DateTime
scalar JSON

enum OrderStatus {
  PENDING
  PROCESSING
  READY_FOR_PICKUP
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

enum ShopStatus {
  ACTIVE
  INACTIVE
  PENDING_APPROVAL
  REJECTED
}

enum DeliveryPartnerStatus {
  AVAILABLE
  ON_DUTY
  OFFLINE
  BUSY
}

type Image{
  public_id: String
  url: String
}

type User {
  _id: ID!
  name: String
  email: String
  avatar: Image
  phone: String!
  isPhoneVerified: Boolean
  addresses: [Address!]!
  orderHistory: [Order!]!
  savedPaymentMethods: [PaymentMethod!]!
  role: UserRole!
}

enum UserRole {
  CUSTOMER
  SHOP_OWNER
  DELIVERY_PARTNER
  ADMIN
}

type Address {
  _id: ID!
  street: String
  city: String
  state: String
  postalCode: String
  latitude: Float
  longitude: Float
  isDefault: Boolean
}

type Product {
  _id: ID!
  name: String!
  shop: LaundryShop!
  service: Service
  rate: Float!
  image: Image
  extraProductDetails: ExtraProductDetails
  createdBy: User
}

type ExtraProductDetails {
  name: String
  description: String
  additionalRate: Float
}

input CategoryInput {
  name: String!
  serviceId: ID!
  image: ImageInput
}



type Category {
  _id: ID!
  name: String!
  service: Service
  image: Image
  products: [Product]
  createdBy: User
}


type Service {
  _id: ID!
  name: String!
  description: String
  image: Image
  categories: [Category]
  createdBy: User
  createdAt: DateTime
  updatedAt: DateTime
}


  input ServiceInput {
  name: String!
  description: String
  image: ImageInput
  categories: [CategoryInput]
  createdBy: String
}

input ImageInput {
  public_id: String
  url: String
}

type LaundryShop {
  _id: ID!
  owner: User!
  name: String!
  address: Address!
  contactNumber: String
  openingHours: String
  rating: Float
  reviews: [Review]
  services: [Service]
  photos: [Image]
  status: ShopStatus!
}

type Service {
  _id: ID!
  shop: LaundryShop
  name: String
  image: Image
  description: String
}

type Review {
  id: ID!
  user: User!
  shop: LaundryShop!
  rating: Int!
  comment: String
  createdAt: DateTime!
}

type Order {
  id: ID!
  user: User!
  shop: LaundryShop!
  items: [OrderItem!]!
  pickupAddress: Address!
  deliveryAddress: Address!
  pickupTime: DateTime
  deliveryTime: DateTime
  orderDate: DateTime!
  status: OrderStatus!
  totalAmount: Float!
  paymentMethod: PaymentMethod
  deliveryPartner: DeliveryPartner
}

type OrderItem {
  id: ID!
  service: Service!
  quantity: Int!
}

type PaymentMethod {
  id: ID!
  user: User!
  type: String!
  details: JSON
}

type DeliveryPartner {
  id: ID!
  user: User!
  currentLocation: Address
  status: DeliveryPartnerStatus!
  assignedOrders: [Order!]!
}

type Offer {
  id: ID!
  shop: LaundryShop!
  name: String!
  description: String
  discountPercentage: Float
  discountAmount: Float
  startDate: DateTime
  endDate: DateTime
  isActive: Boolean!
}

type AuthPayload {
  user_id: String
  message: String
  
}

type AuthResponse {
  user: User,
  access_token:String,
  refresh_token:String
  message:String
  success:Boolean
}

input addressInput {
  street: String
  city: String
  state: String
  postalCode: String
  latitude: Float
  longitude: Float
  isDefault: Boolean
}


input UserProfileInput {
  name: String
  email: String
  defaultAddress: String
}

type Query {
  health:String
  nearbyShops(latitude: Float!, longitude: Float!, radius: Float): [LaundryShop!]!
  shop(id: ID!): LaundryShop
  me: User
  orders: [Order!]!
  order(id: ID!): Order

  # admin queries 
  services: [Service!]!
  service(id: ID!): Service
 
}

type Mutation {
  # user mutations 
  registerUser(phone: String!): AuthPayload!
  verifyOtp(otp:Int!,user_id:String): AuthResponse
  updateUserProfile(input: UserProfileInput!): User!
  addAddress(address: addressInput): Address!
  updateAddress(id: ID!, address: addressInput): Address
  deleteAddress(id: ID!): Boolean!
  placeOrder(shopId: ID!, items: [OrderItemInput!]!, pickupAddressId: ID!, deliveryAddressId: ID!, pickupTime: DateTime, deliveryTime: DateTime, paymentMethodId: ID): Order!
  cancelOrder(orderId: ID!): Order
  addReview(shopId: ID!, rating: Int!, comment: String): Review!

  # shop mutations

  # admin mutations
  createServiceByAdmin(input: ServiceInput!): Service 
  deleteServiceByAdmin(id: ID!): Boolean
  updateServiceByAdmin(id: ID!, input: ServiceInput!): Service
}

input OrderItemInput {
  serviceId: ID!
  quantity: Int!
}
`;

export { typeDefs };
