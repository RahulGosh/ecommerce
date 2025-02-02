import { IOrder, IOrderItem, IShippingInfo } from "../models/orderModel";
import { UserSchema } from "../models/userModel";

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

export interface UpdateCartRequestBody {
  size?: string; // Optional for updates
  quantity?: number;
}

export interface UpdateCartRequestParams {
  productId: string;
}

export interface UpdateCartRequest {
  body: UpdateCartRequestBody;
  params: UpdateCartRequestParams;
  user?: { _id: string };
}

export interface PlaceOrderRequest {
  body: IOrder;
  user?: { _id: string };
}

export interface RemoveFromCartRequestParams {
  productId: string;
}

export interface RemoveFromCartRequestBody {
  size?: string;
}

export interface RemoveFromCartRequest {
  params: RemoveFromCartRequestParams;
  body: RemoveFromCartRequestBody;
  user?: { _id: string };
}

export interface AdjustQuantityRequestParams {
  productId: string;
  size: string;
}

export interface AdjustQuantityRequestBody {
  action: "increase" | "decrease";
}

export interface AdjustQuantityRequest {
  body: AdjustQuantityRequestBody;
  params: AdjustQuantityRequestParams;
  user?: { _id: string };
}

export interface CreateCourseCustomRequest extends Request {
  user?: UserSchema;
  id?: string; // Make it optional if it might not always be present
}