package contexts

import (
	"backend/responses"
	"backend/services"
	"net/http"
	"strings"
)

func AuthContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")

		if !strings.HasPrefix(token, "Bearer ") {
			w.Header().Set("Content-Type", "application/json")

			responses.UnauthorizedResponse(w, "Unauthenticated")

			return
		}

		bearerToken := token[7:]

		if services.VerifyToken(&bearerToken) != nil {
			w.Header().Set("Content-Type", "application/json")

			responses.UnauthorizedResponse(w, "Unauthenticated")

			return
		}

		next.ServeHTTP(w, r)
	})
}
