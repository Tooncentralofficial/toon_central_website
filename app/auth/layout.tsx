import AuthLayout from "./layout/authLayout";

export default function DefaultAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
