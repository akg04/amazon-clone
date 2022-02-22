export const initialState = {
  basket: [],
  user: null,
};

//selector
export const getBasketTotal = (basket) =>
  //sum kr rha h intial value of amount 0 se
  basket?.reduce((amount, item) => item.price + amount, 0);

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        // change the state of basket ,add current item to basket
        basket: [...state.basket, action.item],
      };
    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];
      if (index >= 0) {
        //jaha pehli baar mila tha item us id k sath usse hi hata do aisa bhi ho sakta h ek itme kayi baar liya ho
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Can't remove product (id:${action.id}) as its not in basket!`
        );
      }
      return {
        ...state,
        basket: newBasket,
      };

    case "SETUSER":
      return {
        ...state,
        user: action.user,
      };

    case "EMPTY_BASKET":
      return {
        ...state,
        basket: [],
      };

    default:
      return state;
  }
};
export default reducer;
