export interface TokenRequest {
    token: string
}

export interface LoginResponse {
    id: number,
    token: string,
    email: string,
    name: string,
    picture: string
}