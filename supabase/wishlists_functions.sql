
-- Function to get user wishlist with product details
CREATE OR REPLACE FUNCTION get_user_wishlist(user_id_param UUID)
RETURNS SETOF JSON AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', w.id,
      'product_id', w.product_id,
      'user_id', w.user_id,
      'created_at', w.created_at,
      'product', json_build_object(
        'id', p.id,
        'title', p.title,
        'price', p.price,
        'images', p.images,
        'category', p.category,
        'seller', json_build_object(
          'username', profiles.username,
          'avatar_url', profiles.avatar_url
        )
      )
    )
  FROM 
    wishlists w
  JOIN 
    products p ON w.product_id = p.id
  JOIN 
    profiles ON p.seller_id = profiles.id
  WHERE 
    w.user_id = user_id_param
  ORDER BY 
    w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add to wishlist
CREATE OR REPLACE FUNCTION add_to_wishlist(user_id_param UUID, product_id_param UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO wishlists (user_id, product_id)
  VALUES (user_id_param, product_id_param)
  ON CONFLICT (user_id, product_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove from wishlist
CREATE OR REPLACE FUNCTION remove_from_wishlist(user_id_param UUID, product_id_param UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM wishlists
  WHERE user_id = user_id_param AND product_id = product_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
