import { AdminSearch } from "../admin/search"

export const AdminHeader = async () =>{
    return (
        <header className="flex h-[60px] items-center gap-4 px-4">
            <div className="items-center flex-1 gap-4 md:gap-8 grid grid-cols-3 w-full">
                <div className="col-span-1">
                    <AdminSearch/>
                </div>
            </div>
        </header>
    )
}