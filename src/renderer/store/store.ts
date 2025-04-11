import { configureStore } from "@reduxjs/toolkit";

import scrapingTemplateQueueReducer from "./ducks/scrapingTemplateQueueSlice";
import taskReducer from "./ducks/taskSlice";
import queueReducer from "./ducks/queueSlice";

// import bookmarkReducer from "./ducks/bookmarkSlice";
// import categoryReducer from "./ducks/categorySlice";
// import likeReducer from "./ducks/likeSlice";
// import loginModalReducer from "./ducks/loginModalSlice";
// import userReducer from "./ducks/userSlice";

export const store = configureStore({
  reducer: {
    // user: userReducer,
    // category: categoryReducer,
    // isLoginOpened: loginModalReducer,
    // bookmarkIds: bookmarkReducer,
    // likeIds: likeReducer,
    scrapingTemplateQueue: scrapingTemplateQueueReducer,
    task: taskReducer,
    queueFiles: queueReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
