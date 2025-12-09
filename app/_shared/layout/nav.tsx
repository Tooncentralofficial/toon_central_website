"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Divider,
  Input,
  DropdownSection,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import {
  BellIcon,
  DownMenuArrow,
  SearchIcon,
  ShortIconSelected,
  ShortsIcon,
  ToonCentralIcon,
  TrendingColored,
  UploadComicIcon,
  UploadShortIcon,
} from "../icons/icons";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  getUser,
  logoutSuccess,
  selectAuthState,
} from "@/lib/slices/auth-slice";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LogoutUser } from "@/app/auth/logout/logout";
import { toast } from "react-toastify";
import { Pivot as Hamburger } from "hamburger-react";
import UseTailwindMediaQuery from "@/app/utils/useTailwindMediaQuery";
import { getRequest } from "@/app/utils/queries/requests";
import { parseArray } from "@/helpers/parsArray";
import { motion } from "framer-motion";
import SearchModal from "./search";
import {
  HomeIcon,
  HomeIconColored,
  GenresIcon,
  GenresIconColored,
  TrendingIcon,
  OriginalIcon,
  OriginalIconColored,
} from "../icons/icons";
const menuItems: { name: string; link: string }[] = [
  {
    name: "home",
    link: "/",
  },
  {
    name: "shorts",
    link: "/shorts",
  },
  {
    name: "genres",
    link: "/genres",
  },
  {
    name: "Original",
    link: "/original",
  },
  {
    name: "Trending",
    link: "/trending",
  },
  {
    name: "Creator101",
    link: "/creator",
  },
];
const menuItemsmob: { name: string; link: string }[] = [
  {
    name: "Creator101",
    link: "/creator",
  },
  {
    name: "Notification",
    link: "/notification",
  },
];
const menuItemsMobile: {
  name: string;
  link: string;
  icon: string;
  active: string;
}[] = [
  {
    name: "home",
    link: "/",
    icon: HomeIcon,
    active: HomeIconColored,
  },
  {
    name: "shorts",
    link: "/shorts",
    icon: ShortsIcon,
    active: ShortIconSelected,
  },
  {
    name: "genres",
    link: "/genres",
    icon: GenresIcon,
    active: GenresIconColored,
  },
  {
    name: "Original",
    link: "/original",
    icon: OriginalIcon,
    active: OriginalIconColored,
  },
  {
    name: "Trending",
    link: "/trending",
    icon: TrendingIcon,
    active: TrendingColored,
  },
];

const NavHome = () => {
  let pathname = usePathname();
  const iscomics = usePathname().includes("/comics");
  if (iscomics) {
    console.log(pathname);
    const uuid = pathname.split("/")[2];
    pathname = `/comics/${uuid}`;
  }

  const { user, token } = useSelector(selectAuthState);
  const [isSide, setIsSide] = useState(false);
  const dispatch = useDispatch();
  const logout = () => logoutUser("");
  useEffect(() => {
    dispatch(getUser() as any);
  }, []);

  const { mutate: logoutUser } = useMutation({
    mutationFn: (data: any) => LogoutUser(pathname),
    onSuccess(data, variables, context) {
      toast("Logged out", {
        toastId: "login",
        type: "success",
      });
      dispatch(logoutSuccess());
    },
    onError(error, variables, context) {},
  });

  const handleToggle = () => setIsSide(!isSide);
  const { sm, md, lg } = UseTailwindMediaQuery();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const variant = {
    open: {
      rotate: 90,
      transition: {
        duration: 0.2,
      },
    },
    closed: {
      rotate: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const { onClose, onOpen, isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Navbar
        isBlurred={false}
        shouldHideOnScroll
        className="bg-[var(--bg-menu-cont)] py-10 flex"
        height={md ? "3rem" : "4rem"}
        maxWidth="2xl"
        isMenuOpen={isSide && !lg}
        classNames={{
          menu: "bg-[var(--bg-menu-cont)]",
        }}
      >
        <div className="w-full h-full flex flex-col">
          <div className="flex w-full h-full">
            <NavbarContent className="lg:flex pr-3" justify="center">
              <NavbarBrand className="items-start">
                <Link href="/">
                  <ToonCentralIcon />
                </Link>
              </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden lg:flex gap-8 " justify="center">
              {menuItems.map((item, i) => (
                <NavbarItem key={i}>
                  <Link href={item.link}>
                    <div className="relative capitalize">
                      {item.name}
                      <div
                        className={`${
                          item.link === pathname ? "flex" : "hidden"
                        } absolute bottom-[-28px] left-0 h-[5px] w-full rounded-[2px] bg-[var(--cursor-color)] mt-5`}
                      ></div>
                    </div>
                  </Link>
                </NavbarItem>
              ))}
            </NavbarContent>

            <NavbarMenu>
              <div
                className="
        py-[60px] h-full flex flex-col gap-4 mt-10"
              >
                {menuItemsmob.map((item, index) => (
                  <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                      className="w-full capitalize"
                      color={
                        index === 2
                          ? "warning"
                          : index === menuItems.length - 1
                          ? "danger"
                          : "foreground"
                      }
                      onClick={() => setIsSide(false)}
                      href={item.link}
                      // size="lg"
                    >
                      {item.name}
                    </Link>
                  </NavbarMenuItem>
                ))}
                <div className=" w-full flex ">
                  <Button
                    as={Link}
                    className={`${!token && "bg-transparent min-w-0 px-0"} ${
                      token &&
                      "bg-[var(--green100)] text-white px-[18px] py-[10px] rounded-[8px]"
                    } w-full`}
                    href={token ? "/creator/new" : "/creator"}
                    variant="flat"
                    onClick={() => handleToggle()}
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </NavbarMenu>
            <NavbarContent className="" justify="end">
              <NavbarContent className="flex " justify="end">
                <NavbarItem className="flex items-center gap-4">
                  <button onClick={onOpen}>
                    <SearchIcon />
                  </button>
                  <Divider
                    orientation="vertical"
                    className="h-[36px] border-white"
                  />
                </NavbarItem>

                <div
                  className={`${token ? "flex" : "hidden"} gap-4 items-center`}
                >
                  <div className="hidden sm:flex gap-4 items-center">
                    {token && (
                      <NavbarItem as={Link} href="/user/library">
                        <div className="relative capitalize">
                          My Library
                          <div
                            className={`${
                              "/user/library" === pathname ? "flex" : "hidden"
                            } absolute bottom-[-28px] left-0 h-[5px] w-full rounded-[2px] bg-[var(--cursor-color)] mt-5`}
                          ></div>
                        </div>
                      </NavbarItem>
                    )}

                    <Divider
                      orientation="vertical"
                      className="h-[36px] border-white"
                    />
                  </div>

                  <NavbarItem>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="bg-transparent p-0 min-w-0"
                          disableAnimation
                        >
                          <div className="flex items-center gap-0.5">
                            <User
                              //    as={Button}
                              //  isIconOnly
                              name=""
                              avatarProps={{
                                src: `${
                                  user?.photo ||
                                  "https://avatars.githubusercontent.com/u/30373425?v=4"
                                }`,
                              }}
                              // className="p-0 min-w-0 rounded-[50%]"
                            />

                            <DownMenuArrow />
                          </div>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Notification">
                        <DropdownItem key="profile" className="h-14 gap-2">
                          <p className="font-semibold">Signed in as</p>
                          <p className="font-semibold">{user?.email}</p>
                        </DropdownItem>
                        <DropdownItem as={Link} href="/user/profile" key="1">
                          Profile
                        </DropdownItem>
                        <DropdownItem
                          className="flex sm:hidden"
                          as={Link}
                          href="/user/library"
                          key="2"
                        >
                          Library
                        </DropdownItem>
                        <DropdownItem
                          className="flex sm:hidden"
                          as={Link}
                          href="/subscription"
                          key="2"
                        >
                          subscriptions
                        </DropdownItem>

                        <DropdownItem
                          key="2"
                          className="text-white bg-danger text-center"
                          color="danger"
                          onClick={logout}
                        >
                          Logout
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </NavbarItem>
                </div>

                <NavbarItem className="hidden lg:flex h-full items-center">
                  <Button
                    // as={Link}
                    className={`${!token && "bg-transparent min-w-0 px-0"} ${
                      token &&
                      "bg-[var(--green100)] text-white px-[18px] py-[10px] rounded-[8px]"
                    }`}
                    // href={token ? "/creator/new" : "/creator"}
                    variant="flat"
                    onClick={() => setIsUploadOpen(!isUploadOpen)}
                  >
                    Publish
                  </Button>
                </NavbarItem>
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={
                    isUploadOpen
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: -10, scale: 0.95 }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`absolute right-5 top-16 bg-[#151D29]/95 backdrop-blur-md w-[17rem] p-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#ffffff1a] origin-top-right ${
                    isUploadOpen
                      ? "pointer-events-auto cursor-pointer"
                      : "pointer-events-none"
                  }`}
                >
                  <Link
                    className="flex gap-3 ml-[1.6rem] py-[1rem]"
                    onClick={() => setIsUploadOpen(false)}
                    href={token ? "/creator/new" : "/creator"}
                  >
                    <UploadComicIcon />
                    <p>Upload Comic</p>
                  </Link>
                  <div className="w-full h-[1px] bg-[#FFFFFF3D]" />
                  <Link
                    onClick={() => setIsUploadOpen(false)}
                    className="flex gap-3 ml-[1.6rem] py-[1rem]"
                    href={token ? "/shorts/upload" : "/creator"}
                  >
                    <UploadShortIcon />
                    <p>Upload Shorts</p>
                  </Link>
                </motion.div>

                {!token && (
                  <NavbarItem className="h-full flex items-center">
                    <Button
                      as={Link}
                      className="bg-[var(--green100)] text-white px-[18px] py-[10px] rounded-[8px]"
                      href="/auth/signup"
                      variant="flat"
                    >
                      Get Started
                    </Button>
                  </NavbarItem>
                )}
              </NavbarContent>
              <div className="hidden lg:hidden">
                <Hamburger
                  direction="right"
                  toggled={isSide}
                  toggle={handleToggle}
                />
              </div>
              {/* <NavbarMenuToggle isSelected={isSide} className="lg:hidden h-full font-[#ffffff] outline flex justify-center " icon={<Hamburger
          direction="right"
          toggled={isSide}
          toggle={handleToggle}
        />}/> */}
            </NavbarContent>
          </div>
          <div className="block md:hidden w-full h-full  pb-5 mt-3">
            <div className="flex justify-between items-center w-full  ">
              {menuItemsMobile.map((item, i) => (
                <NavbarItem key={i} className="flex-shrink-0">
                  <Link href={item.link}>
                    <div>
                      {item.link === pathname ? <item.active /> : <item.icon />}
                    </div>
                  </Link>
                </NavbarItem>
              ))}
              <div className="flex-shrink-0">
                <Hamburger
                  direction="right"
                  toggled={isSide}
                  toggle={handleToggle}
                />
              </div>
            </div>
          </div>
        </div>
      </Navbar>
      <SearchModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </>
  );
};

export default NavHome;

{
  /* <NavbarItem>
      <Dropdown>
        <DropdownTrigger>
          <Button className="bg-transparent" isIconOnly>
            <BellIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Notification">
          <DropdownItem key="1">
            Tooncentral Updated Chapter for Red Devils
          </DropdownItem>
          <DropdownItem key="2">
            Tooncentral Updated Chapter for Red Devils
          </DropdownItem>
          <DropdownItem key="3">
            Tooncentral Updated Chapter for Red Devils
          </DropdownItem>
          <DropdownItem
            key="all"
            className="text-danger text-center"
            color="danger"
            as={Link}
            href="/user/notifications"
          >
            See all
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem> */
}
