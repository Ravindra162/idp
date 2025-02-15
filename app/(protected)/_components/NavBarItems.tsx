"use client";
import Link from "next/link";
import React from "react";

export const SidebarItems = ({ userId }: { userId: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
          Order
        </span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <ul className={`${isDropdownOpen ? "block" : "hidden"} py-2 space-y-2`}>
        <li>
          <Link
            href={`/orders/${userId}`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            New Orders
          </Link>
        </li>
        <li>
          <Link
            href={`/orders/records/${userId}`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            records
          </Link>
        </li>
      </ul>
    </>
  );
};

export const AdminSidebar = () => {
  return (
    <>
      <ul className={`space-y-2 font-medium`}>
      <li>
          <Link
            href={`/admin/panels/table`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">Panels</span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/wallet-types/table`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">Wallet Types</span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/user/panel-listing`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/news`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">Add News</span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/wallet `}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">
              Client invoices
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/withdraw_funds `}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">
              Withdrawal Requests
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/wallet/history`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">
              Invoices history
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/withdraw_funds/history`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">
              Refunds history
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/orders`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">Client orders</span>
          </Link>
        </li>
        <li>
           <Link
            href={`/admin/teams/team-table `}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">
              Teams
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/orders/history`}
            className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
          >
            <span className="flex-1 ms-3 whitespace-nowrap">
              Orders history
            </span>
          </Link>
        </li>
        <AdminProducts />
        <AdminAnalytics />
        <SupportPolicies />
        {/* <ProSidebar /> */}
      </ul>
    </>
  );
};

const AdminProducts = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <button
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
          Client Products
        </span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <ul className={`${isDropdownOpen ? "block" : "hidden"} py-2 space-y-2`}>
        <li>
          <Link
            href={`/admin/product `}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Add Product
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/product/product-table`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Product Table
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/product/product-feedback`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Feedbacks
          </Link>
        </li>
      </ul>
    </>
  );
};

export const SupportPolicies = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <button
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
          Support & Policies
        </span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <ul className={`${isDropdownOpen ? "block" : "hidden"} py-2 space-y-2`}>
        <li>
          <Link
            href={`/support_policies/privacy_policy`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link
            href={`/support_policies/refund_policy`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Refund Policy
          </Link>
        </li>
        <li>
          <Link
            href={`/support_policies/terms_conditions`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Terms & Conditions
          </Link>
        </li>
        <li>
          <Link
            href={`/support_policies/about_us`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            About Us
          </Link>
          <Link
            href={`/support_policies/contact_us`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Contact Us
          </Link>
        </li>
      </ul>
    </>
  );
};

const AdminAnalytics = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <button
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
          Analytics
        </span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <ul className={`${isDropdownOpen ? "block" : "hidden"} py-2 space-y-2`}>
        <li>
          <Link
            href={`/admin/analytics/user `}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            User
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/analytics/wallet`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Wallet
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/analytics/product`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Product
          </Link>
        </li>
      </ul>
    </>
  );
};

const ProSidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <button
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
          Pro-user
        </span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <ul className={`${isDropdownOpen ? "block" : "hidden"} py-2 space-y-2`}>
        <li>
          <Link
            href={`/admin/pro-user/wallet/`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            Pro-wallet
          </Link>
        </li>
        <li>
          <Link
            href={`/admin/pro-user/history/`}
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
          >
            history
          </Link>
        </li>
      </ul>
    </>
  );
};
