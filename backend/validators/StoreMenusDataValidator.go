package validators

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"fmt"
	"io"
	"net/http"
)

type StoreMenusDataValidator struct {
	Data struct {
		Type       string `validate:"required,eq=menus"`
		Attributes struct {
			Name  string  `validate:"required"`
			Price float64 `validate:"gte=0,omitempty"`
		} `json:"attributes"`
		Relationships struct {
			MenuItems []struct {
				Type string `validate:"required,eq=menu-items"`
				ID   string `validate:"required"`
			} `json:"menu_items"`
		} `json:"relationships"`
	} `json:"data"`
}

func (storeMenusDataValidator *StoreMenusDataValidator) Validate(body *io.ReadCloser, w *http.ResponseWriter) error {
	var validated StoreMenusDataValidator

	var database = services.GetConnection()

	err := ValidateBody(&validated, body, w)

	if err != nil {
		return err
	}

	err = ValidateStruct(&validated, body, w)

	if err != nil {
		responses.FailedValidationResponse(*w, []error{err})

		return err
	}

	*storeMenusDataValidator = validated

	var relationshipErrors []error

	for index, menu := range storeMenusDataValidator.Data.Relationships.MenuItems {
		if menu.Type != "menu-items" {
			relationshipErrors = append(relationshipErrors, fmt.Errorf("Field type of the menu item at index %d is invalid", index))
		}

		var menuItemFromDatabase models.MenuItem

		result := database.First(&menuItemFromDatabase, menu.ID)

		if result.Error != nil {
			relationshipErrors = append(relationshipErrors, fmt.Errorf("Field id of the menu item at index %d is invalid", index))
		}
	}

	if len(relationshipErrors) > 0 {

		responses.UnprocessableEntityResponse(*w, relationshipErrors)

		return relationshipErrors[0]
	}

	return nil
}
