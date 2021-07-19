import "./assets/css/index.css";

import { App } from "dhx-optimus";

import { FormView } from "./views/FormView";

export class MyApp extends App {
	init() {
		this.show(null, FormView);
	}
}
