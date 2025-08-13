"use client"

import Image from "next/image"
import Link from "next/link"
import LoginImage from "@/assets/images/degree_image.jpg"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {/* <div className="grid gap-2 text-center"> */}
          <div className="">
            <Link href="/" className="flex justify-center items-center gap-2 font-semibold">
              <Image src="/logo.png" className="w-36" alt="Pen Tutor Logo" width={40} height={40} />
              {/* <h1 className="text-3xl font-bold">Pen Tutor</h1> */}
            </Link>
            {/* <p className="text-balance text-muted-foreground mt-2">Enter your details below to create your account</p> */}
          </div>
          {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={LoginImage}
          alt="A group of students studying with books and laptops."
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
