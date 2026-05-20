import React from 'react'
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const Login = () => {
    const { setShowUserLogin, axios, setUser, navigate } = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

            if (data.success) {
                navigate("/");
                setUser(data.user);
                setShowUserLogin(false);
                toast.success(state === "login" ? "Connexion réussie !" : "Votre compte a été créé avec succès !");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        /* FIX: Ajout de fixed, inset-0, et z-index élevé pour couvrir tout l'écran */
        <div 
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    onClick={() => setShowUserLogin(false)}
>
    <form 
        onSubmit={onSubmitHandler} 
        onClick={(e) => e.stopPropagation()} 
        className="
            relative
            flex
            flex-col
            gap-5
            w-full
            max-w-[420px]
            bg-white
            rounded-3xl
            p-8
            md:p-10
            shadow-[0_20px_80px_rgba(0,0,0,0.25)]
            border
            border-gray-100
            animate-in
            fade-in
            zoom-in
            duration-300
        "
    >

        {/* TOP DECORATION */}
        <div className="
            absolute
            top-0
            left-0
            w-full
            h-2
            bg-gradient-to-r
            from-indigo-500
            via-purple-500
            to-pink-500
            rounded-t-3xl
        "></div>


        {/* CLOSE BUTTON */}
        <button 
            type="button"
            onClick={() => setShowUserLogin(false)}
            className="
                absolute
                top-5
                right-5
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-full
                bg-gray-100
                hover:bg-red-100
                text-gray-500
                hover:text-red-500
                transition-all
                duration-300
            "
        >
            <i className="bi bi-x-lg text-lg"></i>
        </button>


        {/* HEADER */}
        <div className="text-center mt-2">

            <h2 className="
                text-3xl
                font-extrabold
                text-gray-800
                tracking-tight
            ">
                {state === "login"
                    ? "Content de te revoir"
                    : "Créer un compte"}
            </h2>

            <p className="
                text-gray-500
                text-sm
                mt-2
            ">
                {state === "login"
                    ? "Connectez-vous pour poursuivre votre voyage"
                    : "Rejoignez-nous et commencez votre expérience"}
            </p>

        </div>


        {/* NAME */}
        {state === "register" && (

            <div className="w-full">

                <label className="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                    block
                ">
                    Nom et prénom
                </label>

                <div className="relative">

                    <i className="
                        bi bi-person
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    "></i>

                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="John Doe"
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            bg-gray-50
                            py-3.5
                            pl-12
                            pr-4
                            outline-none
                            focus:border-indigo-500
                            focus:bg-white
                            transition-all
                            duration-300
                        "
                        type="text"
                        required
                    />

                </div>

            </div>
        )}


        {/* EMAIL */}
        <div className="w-full">

            <label className="
                text-sm
                font-semibold
                text-gray-700
                mb-2
                block
            ">
                Adresse email
            </label>

            <div className="relative">

                <i className="
                    bi bi-envelope
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                "></i>

                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="example@mail.com"
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3.5
                        pl-12
                        pr-4
                        outline-none
                        focus:border-indigo-500
                        focus:bg-white
                        transition-all
                        duration-300
                    "
                    type="email"
                    required
                />

            </div>

        </div>


        {/* PASSWORD */}
        <div className="w-full">

            <label className="
                text-sm
                font-semibold
                text-gray-700
                mb-2
                block
            ">
                Mot de passe
            </label>

            <div className="relative">

                <i className="
                    bi bi-lock
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                "></i>

                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="••••••••"
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3.5
                        pl-12
                        pr-4
                        outline-none
                        focus:border-indigo-500
                        focus:bg-white
                        transition-all
                        duration-300
                    "
                    type="password"
                    required
                />

            </div>

        </div>


        {/* FORGOT PASSWORD */}
        {state === "login" && (

            <div className="w-full flex justify-end -mt-2">

                <p
                    onClick={() => navigate('/forgot-password')}
                    className="
                        text-sm
                        text-indigo-600
                        hover:text-indigo-800
                        cursor-pointer
                        font-semibold
                        transition-all
                        duration-300
                        hover:underline
                    "
                >
                    Mot de passe oublié?
                </p>

            </div>
        )}


        {/* BUTTON */}
        <button
            className="
                w-full
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                hover:from-indigo-700
                hover:to-purple-700
                text-white
                py-3.5
                rounded-2xl
                font-bold
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-300
                hover:scale-[1.02]
                mt-2
            "
        >
            {state === "register"
                ? "Create Account"
                : "Login"}
        </button>


        {/* FOOTER */}
        <div className="text-center pt-2">

            {state === "register" ? (

                <p className="text-sm text-gray-500">

                    Vous avez déjà un compte?

                    <span
                        onClick={() => setState("login")}
                        className="
                            ml-2
                            text-indigo-600
                            font-bold
                            cursor-pointer
                            hover:text-indigo-800
                            transition-all
                            duration-300
                        "
                    >
                        Se connecter
                    </span>

                </p>

            ) : (

                <p className="text-sm text-gray-500">

                    Vous n'avez pas de compte?

                    <span
                        onClick={() => setState("register")}
                        className="
                            ml-2
                            text-indigo-600
                            font-bold
                            cursor-pointer
                            hover:text-indigo-800
                            transition-all
                            duration-300
                        "
                    >
                       S'inscrire
                    </span>

                </p>

            )}

        </div>

    </form>
</div>
    );
}

export default Login;