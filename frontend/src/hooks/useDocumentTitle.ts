import { useEffect } from "react";

export default function DocumentTitle (title:string) {
	useEffect (() => {

		document.title = title;

	},[title])
}