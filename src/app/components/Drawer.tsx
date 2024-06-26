"use client";
import { useState, useEffect, useContext } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// components
import { ThemeContext } from "@/context/ThemeContext";
import Navbar from "./Navbar";
import ThemeButton from "./ThemeButton";

const STORAGE_KEY = "sidebarLinks";

interface Links {
  id: number;
  date: string;
  title: string;
  type: string;
  href: string;
}

function Drawer({ children }: { children: React.ReactNode }) {
  const { title } = useParams<{ title: string }>();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalTitleOpen, setIsModalTitleOpen] = useState<boolean>(false);
  const [links, setLinks] = useState<Links[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Links[]>([]);
  const [newLinkType, setNewLinkType] = useState<"Note" | "ToDo" | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const savedLinks = localStorage.getItem(STORAGE_KEY);
    if (savedLinks) {
      const parsedLinks = JSON.parse(savedLinks);
      setLinks(parsedLinks);
      setFilteredLinks(parsedLinks);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    }, 50);
    return () => clearTimeout(handle);
  }, [links]);

  useEffect(() => {
    setSearch("");
    setFilteredLinks(links);
  }, [title, links]);

  let displayedTitle: string;
  let linkId: number | undefined;
  if (title) {
    const decodedTitle = decodeURIComponent(title);
    const ampersandIndex = decodedTitle.indexOf("&");

    if (ampersandIndex !== -1) {
      displayedTitle = decodedTitle.slice(0, ampersandIndex);
      const paramsId = decodedTitle.slice(ampersandIndex + 1);
      linkId = Number(paramsId);
    } else {
      displayedTitle = decodedTitle;
    }
  } else {
    if (pathname === "/planner") {
      displayedTitle = "🗓️Planner Page";
    } else {
      displayedTitle = "🏠Home Page";
    }
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModalTitle = () => {
    setIsModalTitleOpen(!isModalTitleOpen);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newLinkTitle) {
      createNewPage(newLinkTitle);
      setNewLinkTitle("");
      toggleModalTitle();
    }
  };

  const createNewPage = (title: string) => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const newLink = {
      id: links.length + 1,
      date: `${formattedDate}`,
      title: `${title}`,
      type: `${newLinkType}`,
      href: `/${newLinkType?.toLowerCase()}/${encodeURIComponent(
        title
      )}&${links.length + 1}`,
    };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    setFilteredLinks(updatedLinks);
    window.location.href = newLink.href;
  };

  const searchPage = (keyword: string) => {
    if (keyword && keyword.trim().length > 0) {
      const searchResults = links.filter((link) =>
        link.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredLinks(searchResults);
    } else {
      setFilteredLinks(links);
    }
  };

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer-3"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={toggleDrawer}
        />
        <div className="drawer-content flex flex-col">
          <Navbar title={displayedTitle} />
          {/* Content */}
          <main className="min-h-full max-lg:min-h-screen max-lg:pt-16">
            {children}
          </main>
        </div>
        <div className="drawer-side z-[101]">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div
            className={`w-60 py-2 bg-base-200 px-2 ${
              links.length === 0 ? "h-full flex flex-col" : "min-h-full"
            } `}
          >
            <div className={`flex justify-between items-center`}>
              <Link
                href="/"
                className="active:scale-90 transition-all ease-in-out"
                onClick={toggleDrawer}
              >
                <Image
                  className="w-28"
                  src={`${theme === "light" ? "/Logo.svg" : "/Logo_dark.svg"}`}
                  alt="Logo"
                  width={0}
                  height={0}
                  priority={true}
                />
              </Link>
              <div className="flex items-center">
                <ThemeButton />
                {links.length > 0 ? (
                  <button
                    onClick={toggleModal}
                    className="btn btn-ghost btn-square size-fit px-2"
                    aria-label="open modal"
                  >
                    <i className="fa-solid fa-pen-to-square fa-2xl"></i>
                  </button>
                ) : null}
              </div>
            </div>
            {/* SearchBar */}
            <label className="input input-sm rounded-full h-10 flex items-center gap-2 mt-3">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="grow font-medium"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchPage(e.target.value);
                }}
                aria-label="search"
              />
            </label>
            {/* Nav */}
            <div
              className={`${links.length === 0 ? "h-full flex flex-col" : ""}`}
            >
              {links.length > 0 ? (
                <ul className="menu gap-2 text-lg font-bold">
                  {search
                    ? filteredLinks.map((link) => (
                        <li key={link.id}>
                          <Link
                            className={`focus-within:bg-primary focus-within:text-base-100 h-20 flex items-center
                          ${
                            displayedTitle === link.title && linkId === link.id
                              ? "bg-primary text-base-100"
                              : ""
                          }
                        `}
                            onClick={toggleDrawer}
                            href={link.href}
                          >
                            {`${link.title} - ${link.date}`}
                          </Link>
                        </li>
                      ))
                    : links.map((link) => (
                        <li key={link.id}>
                          <Link
                            className={`focus-within:bg-primary focus-within:text-base-100 h-20 flex items-center
                          ${
                            displayedTitle === link.title && linkId === link.id
                              ? "bg-primary text-base-100"
                              : ""
                          }
                        `}
                            onClick={toggleDrawer}
                            href={link.href}
                          >
                            {`${link.title} - ${link.date}`}
                          </Link>
                        </li>
                      ))}
                </ul>
              ) : (
                <div className="h-full grid place-content-center">
                  <button
                    onClick={toggleModal}
                    className="btn btn-ghost btn-block no-animation size-32 text-5xl text-base/65"
                    aria-label="add new link"
                  >
                    <i className="fa-solid fa-pen-to-square fa-2xl"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <dialog open className="modal bg-black/30">
          <div className="modal-box">
            <button
              onClick={toggleModal}
              className="btn btn-sm btn-circle btn-outline btn-primary text-primary absolute right-3 top-2"
              aria-label="close modal"
            >
              <i className="fa-solid fa-xmark fa-xl"></i>
            </button>
            <form>
              <div className="flex max-sm:flex-col items-center max-sm:gap-2 justify-around mt-6">
                <button
                  type="button"
                  className="btn btn-primary btn-outline w-32 sm:w-56"
                  onClick={() => {
                    setNewLinkType("Note");
                    toggleModal();
                    toggleModalTitle();
                  }}
                >
                  Add Note
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-outline w-32 sm:w-56"
                  onClick={() => {
                    setNewLinkType("ToDo");
                    toggleModal();
                    toggleModalTitle();
                  }}
                >
                  Add ToDo
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {isModalTitleOpen && (
        <dialog open className="modal bg-black/30">
          <div className="modal-box">
            <button
              onClick={toggleModalTitle}
              className="btn btn-sm btn-circle btn-outline btn-primary text-primary absolute right-3 top-2"
              aria-label="close title modal"
            >
              <i className="fa-solid fa-xmark fa-xl"></i>
            </button>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                maxLength={10}
                placeholder="Add Title"
                className="input bg-primary text-white placeholder:text-white/75 w-full mt-8"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                aria-label="new link title"
              />
              {newLinkTitle.length === 10 ? (
                <div className="badge badge-primary badge-outline my-2">
                  Max Length is 10
                </div>
              ) : null}
              <button
                type="submit"
                className="btn btn-primary btn-outline  w-full mt-2"
              >
                Save
              </button>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}

export default Drawer;
