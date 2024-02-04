package contexts

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/jsonapi"
	"gorm.io/gorm/clause"
)

func CommandContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		commandID := chi.URLParam(r, "commandId")

		var command models.Command

		database := services.GetConnection()

		database.Preload(clause.Associations).First(&command, commandID)

		if command.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "command not found")

			return
		}

		ctx := context.WithValue(r.Context(), "command", command)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
