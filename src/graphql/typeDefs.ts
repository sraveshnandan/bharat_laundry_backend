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

type User {
  _id: ID!
  name: String
  email: String
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
  id: ID!
  street: String!
  city: String!
  state: String!
  postalCode: String!
  latitude: Float
  longitude: Float
  isDefault: Boolean
}

type LaundryShop {
  id: ID!
  owner: User!
  name: String!
  address: Address!
  contactNumber: String
  openingHours: String
  rating: Float
  reviews: [Review!]!
  services: [Service!]!
  photos: [String!]!
  status: ShopStatus!
}

type Service {
  id: ID!
  shop: LaundryShop!
  name: String!
  description: String
  price: Float!
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

type Query {
  health:String
  nearbyShops(latitude: Float!, longitude: Float!, radius: Float): [LaundryShop!]!
  shop(id: ID!): LaundryShop
  me: User
  orders: [Order!]!
  order(id: ID!): Order
}

type Mutation {
  registerUser(phone: String!): AuthPayload!
  verifyOtp(otp:Int!,user_id:String): AuthResponse
  updateUserProfile(name: String, phone: String, defaultAddressId: ID): User!
  addAddress(street: String!, city: String!, state: String!, postalCode: String!, latitude: Float, longitude: Float, isDefault: Boolean): Address!
  updateAddress(id: ID!, street: String, city: String, state: String, postalCode: String, latitude: Float, longitude: Float, isDefault: Boolean): Address
  deleteAddress(id: ID!): Boolean!
  placeOrder(shopId: ID!, items: [OrderItemInput!]!, pickupAddressId: ID!, deliveryAddressId: ID!, pickupTime: DateTime, deliveryTime: DateTime, paymentMethodId: ID): Order!
  cancelOrder(orderId: ID!): Order
  addReview(shopId: ID!, rating: Int!, comment: String): Review!
}

input OrderItemInput {
  serviceId: ID!
  quantity: Int!
}
`;

export { typeDefs };
