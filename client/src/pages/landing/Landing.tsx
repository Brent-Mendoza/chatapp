import { useForm, type FieldValues } from "react-hook-form"
import axiosClient from "../../axiosClient"
import { useAuth } from "../Layout"
import { isAxiosError } from "axios"
import { useState } from "react"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters")
    .trim(),
})

export default function Landing() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  })
  const { refetch } = useAuth()
  const [formError, setFormError] = useState<string | undefined>()
  const onSubmit = async (data: FieldValues) => {
    try {
      await axiosClient.post("/auth/login", data)
      await refetch()
      reset()
    } catch (error) {
      if (isAxiosError<{ message: string }>(error)) {
        return setFormError(error.response?.data.message)
      }
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <section className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-7xl max-lg:text-4xl font-bold">
          Let's get things started!
        </h1>
        <h3 className="self-start text-4xl max-lg:text-2xl">
          Create a username to start
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-2 w-full flex flex-col gap-2"
        >
          <input
            type="text"
            placeholder="Enter username..."
            className="w-full border-3 p-4 rounded-xl text-2xl bg-white"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500">{`${errors.username.message}`}</p>
          )}
          {formError && <p className="text-red-500">{formError}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`p-4 px-10 text-2xl self-end  rounded-[100px]  ${
              isSubmitting
                ? "bg-green-500 cursor-not-allowed"
                : "cursor-pointer bg-green-300 hover:bg-green-500 hover:scale-105 duration-200"
            } `}
          >
            {isSubmitting ? "Please Wait..." : "Start!"}
          </button>
        </form>
      </section>
    </main>
  )
}
