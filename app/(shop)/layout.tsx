import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';


export default function ShopLayout({
    children,
}:{
    children:React.ReactNode
}){
    return(
        <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] via-[#f8f5ff] to-[#eee8fd] text-slate-900 overflow-x-hidden w-full">
            <Navbar/>
            <main className="w-full overflow-x-hidden">
                {children}
            </main>
            <Footer/>
        </div>
    );
}