import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const useDateConverter = ({ dateString }) => {
  const [dateObject, setDateObject] = useState(null);

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString);
      setDateObject(date);
    }
  }, [dateString]);

  return dateObject;
};

useDateConverter.propTypes = {
  dateString: PropTypes.string,
};

export default useDateConverter;
