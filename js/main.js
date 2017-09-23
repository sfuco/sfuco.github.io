/*  main.js
 *  JS functions for sfuco-site
 *  Reinier E.
 *  revangel@sfu.ca
 *  2016-2017
 */
$(document).ready(function() {

  // Function Definitions
  ////////////////////////////////////////

  // Navigation

  function updateVerticalNav() {
    var windowPosition = $(window).scrollTop();
    var firstSection = $('section:eq(0)').offset().top;

    if (windowPosition >= firstSection - (firstSection / 4)) {
      verticalNav.fadeIn();
      updateNavColors();
    } else {
      verticalNav.fadeOut();
    }
  }

  function updateNavColors() {
    var windowPosition = $(document).scrollTop();

    $('section').each(function(index) {
      index++; // Since #home is not a <section> but it's still a link
      var currentSectionTop = $(this).offset().top;
      var currentSectionBottom = currentSectionTop +
                                 $(this).outerHeight(true);

      var currentSection = $('#vertical-nav a:eq(' + index + ')');
      var currentSectionID = $(
          '#vertical-nav a:eq(' + index + ')'
      ).attr('id');

      // The (currentSectionTop/4) is to give some padding to the edge detection
      // so that the beginning of the current section doesn't have to be at the
      // very top of the window for it to be registered as the active-nav.
      if (windowPosition >= currentSectionTop - (currentSectionTop / 4)) {
        currentSection.addClass('active-nav');
        $('#vertical-nav a').not('#' + currentSectionID).each(function() {
          $(this).removeClass('active-nav');
        });
      }
    });
  }

  // Overlays

  function closeModalBox() {
    // Since the exec section's modal boxes each have
    // unique hashes, it's easier to check for whether
    // the modal box is from one of the other sections
    // with hashes that we already know beforehand
    if (window.location.hash == '#contact-form-overlay') {
      window.location.hash = '#contact';
    } else {
      window.location.hash = '#execs';
    }
  }

  // Sets the href for an <a>
  // PARAMS:
  // anchor -> the <a> that was pressed
  // direction -> -1 for prev, 1 for next
  function setNavLink(anchor, direction) {
    var link = '#';
    if (direction == -1) {
      link = link.concat(getPrevExecID(anchor));
    } else if (direction == 1) {
      link = link.concat(getNextExecID(anchor));
    }
    anchor.attr('href', link);
  }

  // Returns the id of the sibling immediately
  // before the anchor's top-level parent in the DOM
  // (By default, the <a>s in the exec modal box
  // are nested 4 times within the top level exec div,
  // so that div will be the 4th ancestor element)
  function getPrevExecID(anchor) {
    return anchor.parents().eq(3).prev().attr('id');
  }

  // Returns the id of the sibling immediately
  // after the anchor's top-level parent in the DOM
  function getNextExecID(anchor) {
    return anchor.parents().eq(3).next().attr('id');
  }

  // Contact Form

  function validateContactForm() {
    var str;

    str = $('input[name="name"]').val();
    if (!isNonEmptyField(str)) { // Check that name isn't blank
      $('#error-text').text(
          'Sorry, what was your name again?'
      );
      return false;
    }

    str = $('input[name="email"]').val();
    if (!isValidEmail(str)) { // Check that email is valid (and non-blank)
      $('#error-text').text(
        'We need a valid email address from you!'
      );
      return false;
    }

    str = $('textarea[name="message"]').val();
    if (!isNonEmptyField(str)) { // Check that message isn't blank
      $('#error-text').text(
          'What did you want to contact us about (fill in message field)?'
      );
      return false;
    }
    return true;
  }

  // Returns true if fieldValue is non-empty
  function isNonEmptyField(fieldValue) {
    fieldValue.replace(/\s+/g, ''); // Remove whitespace
    if (fieldValue) {
      return true;
    }
    return false;
  }

  // Returns true if emailString is a valid email address
  function isValidEmail(emailString) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailString)) {
      return true;
    }
    return false;
  }

  // Events
  ////////////////////////////////////////

  $(window).load(function() {
    $('.loading-screen').fadeOut('slow');
  });

  var verticalNav = $('#vertical-nav');

  // Initialize the vertical nav section as hidden
  // since the top of the page will have the
  // horizontal nav visible
  verticalNav.hide();

  // Initialize exec modal window nav links
  $('.prev-button').each(function() {
    setNavLink($(this), -1);
  });
  $('.next-button').each(function() {
    setNavLink($(this), 1);
  });

  // If the page was loaded somewhere halfway down
  updateVerticalNav();

  $(window).on('scroll', function() {
    updateVerticalNav();
  });

  $('#nav-toggle-container, #mobile-nav-menu a').on('click', function() {
    $('#nav-toggle-container').toggleClass('open');
    $('#mobile-nav-menu').toggleClass('open');
  });

  /// Modal Window
  $('.modal-overlay').on('click', function(e) {
    if (e.target != this) {
      return; // Only close if click is outside window
    }
    closeModalBox();
  });

  $('.close-button').on('click', function(e) {
    closeModalBox();
  });

  /// Contact Form
  $('#contact-form').on('submit', function(e) {
    if (!validateContactForm()) {
      e.preventDefault();
    }
    var form = document.getElementById('contact-form');
    form.setAttribute(
        'action', '//formspree.io/' + 'sfuco.team' + '@' + 'gmail' + '.' + 'com'
    );
  });
});
