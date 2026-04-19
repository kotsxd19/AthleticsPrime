// src/components/auth/LoginCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCard() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Por favor completa todos los campos.');
            return;
        }
        setError('');
        navigate('/dashboard');
    };

    return (
        <div className="login-card">

            <h1 className="text-center text-[22px] text-[#1a1a1a] mb-7 font-bold">
                Iniciar sesión
            </h1>

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
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="text-rose-500 text-xs mb-3">{error}</p>
                )}

                {/* Olvidé contraseña */}
                <a href="#" className="login-forgot">
                    ¿Has olvidado la contraseña?
                </a>

                {/* Botón */}
                <button type="submit" className="login-btn">
                    Aceptar
                </button>

            </form>
        </div>
    );
}