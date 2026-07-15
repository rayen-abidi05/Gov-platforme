import { publicApi } from "@/lib/api/publicApi"
import {useQuery} from "@tanstack/react-query"

export default function Contact (){
    const {data,isLoading,isError,isPending} = useQuery ({
        queryKey : ["allUsers"],
        queryFn : async () => {
            const res = await publicApi.get("/api:auth/getUsers");
            return res.data;
        }
    })
    if (isLoading) {
        return (
            <h1>this page still loading ....</h1>
        )
    }

    return (
        <div>
          {isError && <span>There is something wrong</span>}  
        {data && data.map ((item : any)  => (
            <h1>data.name</h1>
        ))}
        </div>
    )
}