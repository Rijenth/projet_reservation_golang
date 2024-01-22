package contexts

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/jsonapi"
)

/*
Ce context est utilisé pour récupérer le modèle User
depuis la base de donnée et le stocker dans le contexte
pour pouvoir l'utiliser dans les controllers.

Le context permet aussi d'arrêter immédiatement l'exécution d'une requête
si le modèle n'est pas trouvé en base de donnée.

Exemple d'utilisation dans un controller:

user := r.Context().Value("user").(models.User)
*/
func UserContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		userID := chi.URLParam(r, "userId")

		var user models.User

		database := services.GetConnection()

		database.First(&user, userID)

		if user.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "User not found")

			return
		}

		ctx := context.WithValue(r.Context(), "user", user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

