# Frontend Test Cases – Lost & Found System


| **Test Case ID** | **Feature**                 | **Page**      | **Scenario Type** | **Description**                   | **Steps**                               | **Expected Result**                 |
| ---------------- | --------------------------- | ------------- | ----------------- | --------------------------------- | --------------------------------------- | ----------------------------------- |
| FTC001           | Login UI                    | Login Page    | Positive          | Verify login page loads correctly | Open application URL                    | Login page displays all UI elements |
| FTC002           | Login Form                  | Login Page    | Negative          | Empty input validation            | Click login without entering data       | Validation error messages displayed |
| FTC003           | Login Button                | Login Page    | Positive          | Valid login submission            | Enter valid credentials and click login | User redirected to dashboard        |
| FTC004           | Login Error                 | Login Page    | Negative          | Invalid login credentials         | Enter wrong password and submit         | Error message displayed             |
| FTC005           | Registration Form           | Register Page | Positive          | Valid user registration           | Fill form and submit                    | Registration successful             |
| FTC006           | Registration Validation     | Register Page | Negative          | Missing required fields           | Submit incomplete form                  | Validation errors shown             |
| FTC007           | Navigation Menu             | Dashboard     | Positive          | Navigation between pages          | Click menu links                        | Correct page loads                  |
| FTC008           | Navigation Error            | Dashboard     | Negative          | Invalid navigation attempt        | Click broken/invalid link               | Error handled or page not found     |
| FTC009           | Report Lost Item UI         | Report Page   | Positive          | Form UI display                   | Open report page                        | All fields and buttons visible      |
| FTC010           | Report Lost Item Submission | Report Page   | Positive          | Submit valid form                 | Enter details and submit                | Success message shown               |
| FTC011           | Report Form Validation      | Report Page   | Negative          | Empty/invalid input               | Submit incomplete form                  | Validation errors displayed         |
| FTC012           | Matching Results UI         | Results Page  | Positive          | Display matching results          | Submit item and view results            | Matching items displayed clearly    |
| FTC013           | Matching Error              | Results Page  | Negative          | No results available              | Submit item with no match               | “No results found” message          |
| FTC014           | Responsive Design           | All Pages     | Positive          | UI responsiveness                 | Resize browser window                   | Layout adjusts properly             |
| FTC015           | Button Click Actions        | All Pages     | Positive          | Button functionality              | Click buttons                           | Correct actions triggered           |
| FTC016           | Logout                      | Dashboard     | Positive          | Logout functionality              | Click logout button                     | User redirected to login page       |
