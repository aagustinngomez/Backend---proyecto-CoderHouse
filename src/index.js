
import App from "./app.js";
import CartRouter from "./routes/cart.routes.js";
import ProductRouter from "./routes/product.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import SessionRouter from "./routes/session.routes.js";
import BillRouter from "./routes/bill.routes.js";
<<<<<<< HEAD
import UsersRouter from "./routes/users.routes.js";

const app = new App(
  [new CartRouter(), new ProductRouter(), new BillRouter(), new UsersRouter()],
=======

const app = new App(
  [new CartRouter(), new ProductRouter(), new BillRouter()],
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
  [new ViewsRouter(), new SessionRouter()]
);

app.listen();
