import { createSlice } from "@reduxjs/toolkit";

const queriesSlice = createSlice({
  name: "Queries",

  initialState: {
    queries: [],
    queryDetails: null,
    isLoading:true,
      error:false,
  },

  reducers: {

    startLoading( state ){
      state.isLoading = true;
   },

hasError(state,action){

state.error = action.payload;
   state.isLoading = false;


},
    CreateQuery(state, action) {
      state.queries.push(action.payload.query);
    },
    FetchQueries(state, action) {
      state.queries = action.payload.queries;
      state.isLoading = false;

    },
    FetchQuery(state, action) {
      const newQueries = action.payload.querie;
      const existingQueries = state.queries.find(
        (querie) => querie.id === newQueries.id
      );

      if (!existingQueries) {
        state.queries.push(action.payload.querie);
      }
      state.queryDetails = action.payload.querie;
    },

    EditQuery(state, action) {
      console.log(action.payload.query);
      const queryArr = state.queries.map((query) =>
        query.id === action.payload.query.id
          ? action.payload.query
          : query
      );
      console.log(queryArr);
      state.queries = queryArr;
    },
    DeleteQuery(state, action) {
      state.queries = state.queries.filter(
        (querie) => querie.id !== action.payload.id
      );
    },

    // addQueriesOfParticularQueries(state,action){

    //   state.allQueriessOfParticularQueries=action.payload.allQueriess;

    // },

    // addSpeakerOfParticularQueries(state,action){

    //   state.allSpeakersOfParticularQueries=action.payload.speakers

    // }
  },
});
export const queriesActions = queriesSlice.actions;
export default queriesSlice;
