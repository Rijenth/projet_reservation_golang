package validators



type StoreMenuItemDataValidator struct {
	Data struct {
		Type       string `validate:"required,eq=menu_items"`
		Attributes struct {
			Name string `validate:"required,min=3,max=255"`
			Type string `validate:"required,min=3,max=255"`
			Price float64 `validate:"required"`
		} `json:"attributes"`
	} `json:"data"`



