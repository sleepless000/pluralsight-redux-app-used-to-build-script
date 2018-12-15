import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { saveCourse, loadCourses } from "../../actions/courseActions";
import { loadAuthors } from "../../actions/authorActions";
import CourseForm from "./CourseForm";
import { getCourseById } from "../../reducers/courseReducer";
import Spinner from "../common/Spinner";
import { coursePropType, authorPropType } from "../propTypes";
import { newCourse } from "../../../tools/mockData";

export class ManageCoursePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      course: { ...this.props.course },
      errors: {},
      saving: false
    };
  }

  componentDidMount() {
    if (this.props.courses.length === 0) this.props.loadCourses();
    if (this.props.authors.length === 0) this.props.loadAuthors();
  }

  // TODO: Eliminate by using a key instead.
  // Populate form when an existing course is loaded directly.
  static getDerivedStateFromProps(props, state) {
    if (props.course.id !== state.course.id) {
      return { course: props.course };
    }
    return null;
  }

  handleChange = event => {
    let course = {
      ...this.state.course,
      [event.target.name]: event.target.value
    };
    return this.setState({ course });
  };

  formIsValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.course.title.length < 2) {
      errors.title = "Title must be at least 2 characters.";
      formIsValid = false;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleSave = event => {
    event.preventDefault();

    if (!this.formIsValid()) {
      return;
    }

    this.setState({ saving: true });
    this.props
      .saveCourse(this.state.course)
      // TODO: Note that this uses an alternative style of redirect. See CoursesPage for <Redirect/>
      // More: https://tylermcginnis.com/react-router-programmatically-navigate/
      .then(() => {
        toast.success("Course saved.");
        this.props.history.push("/courses");
      })
      .catch(error => {
        this.setState({ saving: false, errors: { onSave: error } });
      });
  };

  render() {
    return this.props.authors.length === 0 ? (
      <Spinner />
    ) : (
      <CourseForm
        course={this.state.course}
        onChange={this.handleChange}
        onSave={this.handleSave}
        errors={this.state.errors}
        authors={this.props.authors}
        saving={this.state.saving}
      />
    );
  }
}

ManageCoursePage.propTypes = {
  course: coursePropType.isRequired,
  courses: PropTypes.arrayOf(coursePropType).isRequired,
  authors: PropTypes.arrayOf(authorPropType).isRequired,
  saveCourse: PropTypes.func.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  const courseId = ownProps.match.params.id; // from the path `/course/:id`
  const course =
    courseId && state.courses.length > 0
      ? getCourseById(state.courses, courseId)
      : newCourse;

  return {
    course,
    courses: state.courses,
    authors: state.authors
  };
}

// See https://daveceddia.com/redux-mapdispatchtoprops-object-form/
const mapDispatchToProps = {
  saveCourse,
  loadAuthors,
  loadCourses
};

// Or, more explicit:
// function mapDispatchToProps(dispatch) {
// return {
//   saveCourse: dispatch(saveCourse),
//   loadAuthors: dispatch(loadAuthors)
// };
// }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCoursePage);
