package com.evently.user_service.controller;

import com.evently.common.security.AuthenticatedUser;
import com.evently.user_service.dto.UpdateUserRoleRequest;
import com.evently.user_service.dto.UserProfileResponse;
import com.evently.user_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getUsers(Authentication authentication) {
        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getUsers(authenticatedUser));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserProfileResponse> updateUserRole(@PathVariable Long id,
                                                              @Valid @RequestBody UpdateUserRoleRequest request,
                                                              Authentication authentication) {
        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(userService.updateUserRole(id, request.getRole(), authenticatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication authentication) {
        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        userService.deleteUser(id, authenticatedUser);
        return ResponseEntity.noContent().build();
    }
}
