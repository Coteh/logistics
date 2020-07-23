import React from "react";
import "jest"
import { render } from "@testing-library/react";
import CalendarHeader from "./CalendarHeader";

describe('CalendarColumn', () => {
    it("should render without crash", () => {
        render(<CalendarHeader cellWidth={60} cellHeight={30}/>);
    });
    it('should render a header', () => {
        throw new Error("Not implemented");
    });
    it('should render header text', () => {
        throw new Error("Not implemented");
    });
});