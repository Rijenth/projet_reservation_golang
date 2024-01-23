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

func CommandeContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		commandeID := chi.URLParam(r, "commandeId")

		var commande models.Commande

		database := services.GetConnection()

		database.First(&commande, commandeID)

		if commande.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "commande not found")

			return
		}

		ctx := context.WithValue(r.Context(), "commande", commande)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
