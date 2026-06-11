// src/components/auth/LoginCard.jsx
import useLogin from '../../hooks/useLogin';

export default function LoginCard() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        role,
        setRole,
        loading,
        error,
        handleSubmit,
    } = useLogin();

    return (
        <div className="login-card">
            {/* Logo */}
            <div className="login-logo">
                PA
            </div>

            <h1 className="text-center text-[22px] text-[#1a1a1a] mb-5 font-bold">
                Prime Athletics
            </h1>

            {/* Selector de Rol en Pestañas */}
            <div className="flex border-b border-slate-100 mb-6">
                <button
                    type="button"
                    onClick={() => setRole('employee')}
                    className={`flex-1 pb-3 text-sm font-semibold transition-all duration-200 border-b-2 cursor-pointer ${
                        role === 'employee'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <i className="fa-solid fa-user-tie mr-2"></i>Empleado
                </button>
                <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 pb-3 text-sm font-semibold transition-all duration-200 border-b-2 cursor-pointer ${
                        role === 'admin'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <i className="fa-solid fa-user-shield mr-2"></i>Administrador
                </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="login-label">
                        Correo electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        className="login-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {/* Password */}
                <div className="mb-2">
                    <label htmlFor="password" className="login-label">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="login-input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-rose-500 text-xs mb-3 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                        <i className="fa-solid fa-circle-exclamation text-rose-400"></i>
                        <span>{error}</span>
                    </div>
                )}

                {/* Olvidé contraseña */}
                <a href="#" className="login-forgot">
                    ¿Has olvidado la contraseña?
                </a>

                {/* Botón */}
                <button 
                    type="submit" 
                    className={`login-btn flex items-center justify-center gap-2 cursor-pointer ${loading ? 'opacity-75 cursor-wait' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Iniciando sesión...</span>
                        </>
                    ) : (
                        <span>Ingresar</span>
                    )}
                </button>

            </form>
        </div>
    );
}