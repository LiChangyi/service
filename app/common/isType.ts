export const isTCtxUser = (params: Boolean | TCtxUser): params is TCtxUser => (<TCtxUser>params).uid !== undefined;

export default {};
