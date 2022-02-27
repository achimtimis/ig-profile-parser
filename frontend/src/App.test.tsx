import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

import * as backendApi from "./api/backendApi";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "./models/instagramProfileModels";

test("that the application renders and the welcome page header title is correct", () => {
  render(<App />);
  const headerText = screen.getByText(/Instagram user profile details/i);
  expect(headerText).toBeInTheDocument();
});

test("when searching a handle and a valid response is received, the expected output is rendered", async () => {
  // mock backend api response
  const mock = jest
    .spyOn(backendApi, "getInstagramUserProfile")
    .mockResolvedValue({ error: null, data: MOCK_PROFILE_RESPONSE });

  render(<App />);

  // check that submit is disabled until handle is added
  let searchBtn: any = screen.getByTestId("search-btn");
  expect(searchBtn).toBeDisabled();
  let handleInput: any = screen.getByTestId("handle-input");

  // simulate adding value to the handle text input
  fireEvent.change(handleInput, { target: { value: "demo" } });
  await waitFor(() => expect(handleInput.value).toBe("demo"));

  // check that the submit button is now enabled
  await waitFor(() => expect(searchBtn).not.toBeDisabled());

  // simulate the the submit button is clicked
  act(() => {
    userEvent.click(searchBtn);
  });

  // validate that the backend is called
  await waitFor(() => expect(mock).toHaveBeenCalled());
  // validate that the backend api reponse content is displayed
  await waitFor(() => expect(screen.getByText(/Simona/)).toBeInTheDocument());

  mock.mockRestore();
});

const MOCK_PROFILE_RESPONSE: UserProfile = {
  retrievalDate: "1644858868",
  biography: "Professional tennis player 🙃",
  followCount: 1697446,
  fullName: "Simona Halep",
  latestPost: {
    caption: "Happy to be back on court ❤️ \n@nikecourt \n@wilsontennis",
    commentCount: 482,
    date: 1644858868,
    likeCount: 32570,
    type: "GraphImage",
  },
  profilePicture:
    "https://instagram.fclj2-1.fna.fbcdn.net/v/t51.2885-19/s320x320/156726735_921741491985684_5154295808143221639_n.jpg?_nc_ht=instagram.fclj2-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=GOZfkyjDWQ4AX9Ox85K&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT_SoGCxR-9yIOXEXmndBB_RlllAkhVHulP2DTGFDToEXg&oe=6217F8BC&_nc_sid=7bff83",
};
